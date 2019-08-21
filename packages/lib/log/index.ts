// import Consola from 'consola'
import { LOG_LEVEL } from '@dipperin/lib/constants'

class Logger {
  private _logLevel: number = LOG_LEVEL
  private _tag: string
  constructor(tag: string, logLevel: number) {
    this._tag = tag
    this._logLevel = logLevel
  }

  debug(...msg) {
    if (this._logLevel >= 5) {
      console.log(
        `[${new Date().toLocaleTimeString()}]%c[${this._tag.toUpperCase()}]%c[DEBUG]`,
        'font-weight: bold;',
        'color:SteelBlue;',
        ...msg
      )
    }
  }

  info(...msg) {
    if (this._logLevel >= 4) {
      console.log(
        `[${new Date().toLocaleTimeString()}]%c[${this._tag.toUpperCase()}]%c[INFO]`,
        'font-weight: bold;',
        'color:Green;',
        ...msg
      )
    }
  }

  warn(...msg) {
    if (this._logLevel >= 3) {
      console.log(
        `[${new Date().toLocaleTimeString()}]%c[${this._tag.toUpperCase()}]%c[WARN]`,
        'font-weight: bold;',
        'color:Orange;',
        ...msg
      )
    }
  }

  error(...msg) {
    if (this._logLevel >= 2) {
      console.log(
        `[${new Date().toLocaleTimeString()}]%c[${this._tag.toUpperCase()}]%c[ERROR]`,
        'font-weight: bold;',
        'color:red;',
        ...msg
      )
    }
  }

  fatal(...msg) {
    if (this._logLevel >= 1) {
      console.log(
        `[${new Date().toLocaleTimeString()}]%c[${this._tag.toUpperCase()}]%c[FATAL]`,
        'font-weight: bold;',
        'color:DarkRed;',
        ...msg
      )
    }
  }
}

export const backgroundLog = new Logger('background-script', LOG_LEVEL)

export const contentScriptLog = new Logger('content-script', LOG_LEVEL)

export const popupLog = new Logger('popup', LOG_LEVEL)

export const pageHookLog = new Logger('page-hook', LOG_LEVEL)
