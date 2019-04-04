import EventEmitter from 'eventemitter3'
import extensionizer from 'extensionizer'
import randomUUID from 'uuid/v4'
import Consola from 'consola'

import { IncomingCallback, OutgoingCallback, Message, MessageData, Res } from './index'

const log = Consola.withTag('child-duplex').create({
  level: 5
})

class ChildDuplex extends EventEmitter {
  type: string
  incoming: Map<string, IncomingCallback>
  outgoing: Map<string, OutgoingCallback>
  channel?: chrome.runtime.Port

  constructor(type: string) {
    super()

    if (!['tab', 'popup'].includes(type)) {
      throw new Error(`MessageDuplexChild expects a source type of either tab or popup, instead "${type}" was provided`)
    }

    this.type = type
    this.incoming = new Map() // Incoming message replies
    this.outgoing = new Map() // Outgoing message replies

    this.connectToHost()
  }

  send(action: string, data: any, requiresAck = true) {
    const channel = this.channel

    if (!channel) {
      log.error('Unknown disconnect')
      return undefined
    }

    if (!requiresAck) {
      channel.postMessage({ action, data, noAck: true })
      return undefined
    }

    return new Promise(resolve => {
      const messageID = randomUUID()

      this.outgoing.set(messageID, resolve)
      channel.postMessage({
        action,
        data,
        messageID,
        noAck: false
      })
    })
  }

  private connectToHost() {
    this.channel = extensionizer.runtime.connect({
      name: this.type
    })

    this.channel!.onMessage.addListener(message => {
      this.handleMessage(message)
    })

    this.channel!.onDisconnect.addListener(() => {
      const error = 'Unknown disconnect'

      log.error('Lost connection to DuplexHost: ' + error)

      this.connectToHost()
    })
  }

  private handleMessage({ action, data, messageID, noAck = false }: Message) {
    // logger.info('Received new message', { action, data, messageID });

    if (action === 'messageReply') {
      return this.handleReply(data)
    }

    if (noAck) {
      return this.emit(action, data)
    }

    this.incoming.set(messageID, res => this.send('messageReply', { messageID, ...res }, false))

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
      data
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

export default ChildDuplex
