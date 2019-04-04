import EventEmitter from 'eventemitter3'
import { Handler } from '../handlers/request'
import { APP_APPROVE, IS_APPROVED, GET_ACTIVE_ACCOUNT_ADDRESS, SEND } from '@dipperin/lib/constants'

class DipperinExtension extends EventEmitter {
  request: Handler
  constructor(request: Handler) {
    super()
    this.request = request
  }

  isApproved(appName: string) {
    return this.request(IS_APPROVED, appName)
  }

  approve(appName: string) {
    return this.request(APP_APPROVE, appName)
  }

  getActiveAccountAddress(appName: string) {
    return this.request(GET_ACTIVE_ACCOUNT_ADDRESS, appName)
  }

  send(appName: string, to: string, value: string, extraData: string) {
    return this.request(SEND, { appName, to, value, extraData })
  }
}

export default DipperinExtension
