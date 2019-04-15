// import Consola from 'consola'
import EventChannel from '@dipperin/lib/eventChannel'

import DipperinExtension from './extension'
import buildRequestHandler, { Handler } from './handlers/request'
import { APPROVE_SUCCESS, CHNAGE_ACTIVE_ACCOUNT, CHANGE_ACTIVE_ACCOUNT, SEND_SUCCESS } from '@dipperin/lib/constants'
import { pageHookLog as log } from '@dipperin/lib/log'

declare global {
  interface Window {
    dipperinEx: DipperinExtension
  }
}

// const log = Consola.withScope('page-hook').create({
//   level: 5
// })

export default class PageHook {
  eventChannel: EventChannel
  request: Handler

  constructor() {
    this.eventChannel = new EventChannel('page-hook')
    this.request = buildRequestHandler(this.eventChannel)
    this.bindDipperinEx()
    this.bindContentRequest()
  }

  init() {
    this.request<{}>('init')
      .then(() => {
        log.info('Extension initiated')
      })
      .catch(err => {
        log.info('Failed to initialise Extension' + err)
      })
  }

  private bindDipperinEx() {
    log.debug('bind dipperin ex')
    window.dipperinEx = new DipperinExtension(this.request)
  }

  private bindContentRequest() {
    this.eventChannel.on(APPROVE_SUCCESS, params => {
      window.dipperinEx.emit(APPROVE_SUCCESS, params)
    })
    this.eventChannel.on(CHNAGE_ACTIVE_ACCOUNT, address => {
      window.dipperinEx.emit(CHANGE_ACTIVE_ACCOUNT, address)
    })
    this.eventChannel.on(SEND_SUCCESS, params => {
      window.dipperinEx.emit(SEND_SUCCESS, params)
    })
  }
}
