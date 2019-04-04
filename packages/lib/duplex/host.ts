import EventEmitter from 'eventemitter3'
import extensionizer from 'extensionizer'
import randomUUID from 'uuid/v4'
import Consola from 'consola'

import { ChannelMap, IncomingCallback, OutgoingCallback, Message, MessageData, Res } from './index'

const log = Consola.withTag('host-duplex').create({
  level: 5
})

class HostDuplex extends EventEmitter {
  channels: Map<string, ChannelMap>
  incoming: Map<string, IncomingCallback>
  outgoing: Map<string, OutgoingCallback>
  constructor() {
    super()

    this.channels = new Map()
    this.incoming = new Map() // Incoming message replies
    this.outgoing = new Map() // Outgoing message replies

    extensionizer.runtime.onConnect.addListener(channel => this.handleNewConnection(channel))
  }

  broadcast(action: string, data: any, requiresAck = true) {
    const promises: any[] = []
    this.channels.forEach((_, channelGroup) => {
      promises.push(() => this.send(channelGroup, action, data, requiresAck))
    })
    return Promise.all(promises)
  }

  send(target = '', action: string, data: any, requiresAck = true) {
    const targetChannel = this.channels.get(target)

    if (!targetChannel) {
      return
    }

    if (!requiresAck) {
      return targetChannel.forEach(({ channel }) => channel.postMessage({ action, data, noAck: true }))
    }

    return new Promise(resolve => {
      const messageID = randomUUID()

      this.outgoing.set(messageID, resolve)

      targetChannel.forEach(({ channel }) => channel.postMessage({ action, data, messageID, noAck: false }))
    })
  }

  private handleNewConnection(channel: chrome.runtime.Port) {
    const sender = channel.sender!

    const extensionID = sender.id
    const uuid = randomUUID()

    if (extensionID !== extensionizer.runtime.id) {
      channel.disconnect()
      return log.warn(`Dropped unsolicited connection from ${extensionID}`)
    }

    const name = channel.name
    const url = sender.url

    if (!this.channels.has(name)) {
      this.emit(`${name}:connect`)
    }

    const channelList = this.channels.get(name) || new Map()
    const hostname = new URL(url!).hostname

    this.channels.set(
      name,
      channelList.set(uuid, {
        channel,
        url
      })
    )

    channel.onMessage.addListener(message =>
      this.handleMessage(name, {
        ...message,
        hostname
      })
    )

    channel.onDisconnect.addListener(() => {
      // Delete any pending requests that match this name + id

      const channels = this.channels.get(name)

      if (!channels) {
        return
      }

      channels.delete(uuid)

      if (!channels.size) {
        this.channels.delete(name)
        this.emit(`${name}:disconnect`)
      }
    })
  }

  private handleMessage(source: string, message: Message) {
    const { noAck = false, hostname, messageID, action, data } = message

    if (action === 'messageReply') {
      return this.handleReply(data)
    }

    if (source === 'tab' && !['tabRequest'].includes(action)) {
      return log.error(`Droping unauthorized tab request: ${action}` + data)
    }

    if (noAck) {
      return this.emit(action, { hostname, data })
    }

    this.incoming.set(messageID, res =>
      this.send(
        source,
        'messageReply',
        {
          messageID,
          ...res
        },
        false
      )
    )

    this.emit(action, {
      resolve: (res: Res) => {
        const cb = this.incoming.get(messageID)

        if (!cb) {
          return log.warn(`Message ${messageID} expired`)
        }

        cb({ error: false, res })
        this.incoming.delete(messageID)
      },
      reject: (res: Res) => {
        const cb = this.incoming.get(messageID)
        if (!cb) {
          return log.warn(`Message ${messageID} expired`)
        }

        cb({ error: true, res })
        this.incoming.delete(messageID)
      },
      data,
      hostname
    })
  }

  private handleReply({ messageID, error, res }: MessageData) {
    const cb = this.outgoing.get(messageID)

    if (!cb) {
      return
    }

    if (error) {
      cb(Promise.reject(res))
    } else {
      cb(res)
    }

    this.outgoing.delete(messageID)
  }
}

export default HostDuplex
