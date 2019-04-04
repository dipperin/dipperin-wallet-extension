import { isFunction } from 'lodash'
import { TIMER } from '@dipperin/lib/constants'

class TimerStore {
  private _events: Map<string, any> = new Map()

  on(name: string, method: () => void, interval: number): void {
    if (!isFunction(method) || this._events.has(name)) {
      return
    }
    const timer = setInterval(method, interval)
    this._events.set(name, timer)
  }

  asyncOn(name: string, method: () => void, interval: number): void {
    if (!isFunction(method) || this._events.has(name)) {
      return
    }
    let isRunning = false

    const run = async () => {
      if (isRunning) {
        return
      }
      isRunning = true
      await method()
      isRunning = false
    }
    const timer = setInterval(run, interval)
    this._events.set(name, timer)
  }

  off(name: string) {
    clearInterval(this._events.get(name)!)
    this._events.delete(name)
  }

  stopUpdate() {
    for (const timer of this._events.keys()) {
      if (timer === TIMER.CHECK_IS_CONNECTING) {
        continue
      }
      this.off(timer)
      this._events.delete(timer)
    }
  }

  clear() {
    for (const timer of this._events.keys()) {
      this.off(timer)
    }
    this._events.clear()
  }
}

export default TimerStore
