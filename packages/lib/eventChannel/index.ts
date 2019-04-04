import EventEmitter from 'eventemitter3'

class EventChannel extends EventEmitter {
  private channelKey: string
  constructor(channelKey = '') {
    super()

    if (!channelKey) {
      throw new Error('No channel scope provided')
    }

    this.channelKey = channelKey
    this.registerEventListener()
  }

  send(action = '', data = {}) {
    if (!action) {
      return { success: false, error: 'Function requires action {string} parameter' }
    }

    window.postMessage(
      {
        message: {
          action,
          data
        },
        source: this.channelKey,
        isExtension: true
      },
      '*'
    )

    return { success: true }
  }

  private registerEventListener() {
    window.addEventListener('message', ({ data: { isExtension = false, message, source } }) => {
      if (!isExtension || (!message && !source)) {
        return
      }

      if (source === this.channelKey) {
        return
      }

      const { action, data } = message

      this.emit(action, data)
    })
  }
}

export default EventChannel
