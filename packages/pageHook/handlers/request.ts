import randomUUID from 'uuid/v4'
import EventChannel from '@dipperin/lib/eventChannel'

interface Call<T> {
  resolve: (value?: T | PromiseLike<T>) => void
  reject: (reason?: any) => void
}

export type Handler = <T>(action: string, data?: {}) => Promise<T>

const buildRequestHandler = (eventChannel: EventChannel): Handler => {
  const calls: Map<string, Call<any>> = new Map()

  eventChannel.on('tabReply', ({ success, data, uuid }) => {
    const call = calls.get(uuid)
    if (!call) {
      return
    }

    if (success) {
      call.resolve(data)
    } else {
      call.reject(data)
    }

    calls.delete(data)
  })

  return (action: string, data = {}) => {
    const uuid = randomUUID()

    eventChannel.send('tunnel', {
      action,
      data,
      uuid
    })

    return new Promise((resolve, reject) => {
      calls.set(uuid, {
        resolve,
        reject
      })
    })
  }
}

export default buildRequestHandler
