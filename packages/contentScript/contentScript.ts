import Consola from 'consola'
import extensionizer from 'extensionizer'
import { Tab } from '@dipperin/lib/duplex'
import EventChannel from '@dipperin/lib/eventChannel'

const log = Consola.withTag('content-script').create({
  level: 5
})

export default class ContentScript {
  duplex = new Tab()
  eventChannel = new EventChannel('content-script')
  init() {
    this.injectHook()
    this.registerListeners()
  }

  private registerListeners() {
    this.eventChannel.on('tunnel', async data => {
      try {
        this.eventChannel.send('tabReply', await this.duplex.send('tabRequest', data))
      } catch (ex) {
        log.info('Tab request failed:' + ex)
      }
    })

    this.duplex.on('tunnel', ({ action, data }) => {
      this.eventChannel.send(action, data)
    })
  }

  private injectHook() {
    if (process.env.NODE_ENV === 'test') {
      return
    }
    log.debug('dipperin injected')

    const container = document.head || document.documentElement
    const scriptTag = document.createElement('script')

    scriptTag.src = extensionizer.extension.getURL('build/pageHook.js')
    scriptTag.onload = () => {
      container.removeChild(scriptTag)
    }

    container.insertBefore(scriptTag, container.children[0])
  }
}
