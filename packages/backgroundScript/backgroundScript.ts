import { Host } from '@dipperin/lib/duplex'
import { requestHandle } from '@dipperin/lib/utils'
// import Consola from 'consola'
import HandleService from './handleService'
import BackgroundAPI from './api/background'
import {
  GET_APP_STATE,
  SET_APP_STATE,
  SEND_APP_STATE,
  CREATE_WALLET,
  IMPORT_WALLET,
  UNLOCK_WALLET,
  GET_ACCOUNTS,
  ADD_ACCOUNT,
  DELETE_ACCOUNT,
  UPDATE_ACCOUNT_BALANCE,
  UPDATE_TX_STATUS,
  GET_MNEMONIC,
  CHANGE_ACTIVE_ACCOUNT,
  GET_ACTIVE_ACCOUNT,
  // GET_MIN_TRANSACTION_FEE,
  SEND_TRANSACTION,
  GET_TRANSACTIONS,
  UPDATE_ACCOUNT_NAME,
  RESET_WALLET,
  APP_APPROVE,
  IS_APPROVED,
  GET_ACTIVE_ACCOUNT_ADDRESS,
  CHNAGE_ACTIVE_ACCOUNT,
  SEND,
  APP_STATE,
  APP_SEND,
  SEND_SUCCESS,
  GET_APP_TX,
  SET_PASSWORD,
  CHANGE_NET,
  GET_CURRENT_NET,
  GET_APP_NAME,
  UPDATE_ACCOUNT_LOCK_BALANCE,
  GET_ESTIMATE_GAS
} from '@dipperin/lib/constants'
import { AccountBalanceParams, AccountLockBalanceParams } from '@dipperin/lib/models/account'
import { TxStatusParams } from '@dipperin/lib/models/transaction'
import { addWhiteList, isApproved } from './storage'

import { backgroundLog as log } from '@dipperin/lib/log'

// const log = Consola.withTag('background-script').create({
//   level: 5
// })

class BackgroundScript {
  appName?: string
  duplex: InstanceType<typeof Host>
  service: HandleService
  // storageService: StorageService
  api: BackgroundAPI
  popupId?: number
  windowRemoveListener: (id: number) => void
  constructor() {
    this.duplex = new Host()
    this.service = requestHandle(new HandleService())
    this.api = new BackgroundAPI(this.duplex)
  }

  run() {
    log.info('background script init')
    this.bindPopupDuplex()
    this.bindTabDuplex()
    this.bindServiceEvent()
  }

  private bindPopupDuplex() {
    this.duplex.on('popup:connect', () => {
      log.info('popup connect')
      this.service.popupConnect()
    })

    this.duplex.on('popup:disconnect', () => {
      log.info('popup disconnect')
      this.service.popupDisconnect()
    })

    this.duplex.on(GET_APP_STATE, this.service.getAppState)
    this.duplex.on(SET_APP_STATE, this.service.setAppSate)
    this.duplex.on(GET_MNEMONIC, this.service.getMenmonic)
    this.duplex.on(SET_PASSWORD, this.service.setPassword)
    this.duplex.on(CREATE_WALLET, this.service.createWallet)
    this.duplex.on(IMPORT_WALLET, this.service.importWallet)
    this.duplex.on(UNLOCK_WALLET, this.service.unlockWallet)
    this.duplex.on(GET_ACCOUNTS, this.service.getAccounts)
    this.duplex.on(ADD_ACCOUNT, this.service.addAcount)
    this.duplex.on(GET_ACTIVE_ACCOUNT, this.service.getActiveAccount)
    this.duplex.on(CHANGE_ACTIVE_ACCOUNT, this.service.changeActiveAccount)
    this.duplex.on(UPDATE_ACCOUNT_NAME, this.service.updateAccountName)
    this.duplex.on(DELETE_ACCOUNT, this.service.deleteAccount)
    // this.duplex.on(GET_MIN_TRANSACTION_FEE, this.service.getMinTxFee)
    this.duplex.on(GET_ESTIMATE_GAS, this.service.getEstimateGas)
    this.duplex.on(SEND_TRANSACTION, this.service.sendTx)
    this.duplex.on(GET_TRANSACTIONS, this.service.getTxs)
    this.duplex.on(RESET_WALLET, this.service.resetWallet)
    this.duplex.on(APP_SEND, this.service.appSendTx)
    this.duplex.on(CHANGE_NET, this.service.changeNet)
    this.duplex.on(GET_CURRENT_NET, this.service.getCurrentNet)
    this.duplex.on(GET_APP_NAME, this.service.getAppName)
    /**
     * for app event
     */
    this.duplex.on(APP_APPROVE, this.approveConfirm.bind(this))
    this.duplex.on(GET_APP_TX, this.getAppTx.bind(this))
  }

  private bindTabDuplex() {
    this.duplex.on('tabRequest', async ({ resolve, data: { action, data, uuid } }) => {
      switch (action) {
        case 'init': {
          resolve({
            success: true,
            data: {},
            uuid
          })

          break
        }
        case IS_APPROVED: {
          this.isApproved(data, resolve, uuid)
          break
        }
        case APP_APPROVE: {
          this.approve(data, resolve, uuid)
          break
        }
        case GET_ACTIVE_ACCOUNT_ADDRESS: {
          this.getActiveAccountAddress(data, resolve, uuid)
          break
        }
        case SEND: {
          this.send(data, resolve, uuid)
          break
        }
        default:
          resolve({
            success: false,
            data: 'Unknown method called',
            uuid
          })
          break
      }
    })
  }

  private bindServiceEvent() {
    // send app state
    this.service.on(SEND_APP_STATE, (state: number) => {
      this.api.sendAppState(state)
    })

    // update account balance
    this.service.on(UPDATE_ACCOUNT_BALANCE, (params: AccountBalanceParams) => {
      this.api.updateAccountBalance(params)
    })

    this.service.on(UPDATE_ACCOUNT_LOCK_BALANCE, (param: AccountLockBalanceParams) => {
      this.api.updateAccountLockBalance(param)
    })

    // update tx status
    this.service.on(UPDATE_TX_STATUS, (params: TxStatusParams) => {
      this.api.updateTxStatus(params)
    })

    // change active account (to pagehook)
    this.service.on(CHNAGE_ACTIVE_ACCOUNT, (address: string) => {
      this.api.changeActiveAccount(address)
    })

    // send tx success (to pagehook)
    // this.service.on(SEND_SUCCESS, (params: SendSuccessParams) => {
    //   this.api.sendTxSuccess(params)
    // })

    // send success( close popup)
    this.service.on(SEND_SUCCESS, () => {
      chrome.windows.remove(this.popupId)
    })
  }

  /***** pagehook callbacks */
  /**
   * judge is Approved
   */
  private async isApproved(appName: string, resolve, uuid: string) {
    const approved = await isApproved(appName)
    const res: IsApprovedRes = {
      isApproved: approved
    }
    log.debug(`${appName} approved?:${approved}`)
    resolve({
      success: true,
      data: res,
      uuid
    })
  }

  /**
   * bet approve
   */
  private async approve(appName: string, resolve, uuid: string) {
    this.appName = appName
    this.service.appName = appName
    const res: ApproveRes = {
      popupExist: !!this.popupId,
      isHaveWallet: this.service.isHaveWallet,
      isUnlock: this.service.isUnlock
    }

    if (!res.isHaveWallet || !res.isUnlock || this.popupId) {
      resolve({
        success: false,
        data: res,
        uuid
      })
      return
    }
    this.service.setAppSate(APP_STATE.DAPP_AUTH)
    await this.openPopup()
    const approved = isApproved(appName)
    if (!approved) {
      res.info = 'approved filed!'
    }
    resolve({
      success: approved,
      data: res,
      uuid
    })
  }

  /**
   * popup confirm approve
   */
  private approveConfirm() {
    if (this.appName) {
      addWhiteList(this.appName)
    }

    const params: AppproveSuccessRes = { appName: this.appName }
    this.api.approveSuccess(params)
    console.log(params)
    this.appName = undefined
    this.service.appName = undefined
    // close popup by id
    if (this.popupId) {
      chrome.windows.remove(this.popupId)
    }
    this.service.setAppStateToHome()
  }

  /**
   * popup get app tx data
   */
  getAppTx({ resolve }) {
    resolve(this.service.sendData)
  }

  /**
   * get active account
   */
  private async getActiveAccountAddress(appName: string, resolve, uuid: string) {
    let address: string = ''
    const approved = await isApproved(appName)
    const activeAccount = this.service.activeAccount
    if (approved && activeAccount && activeAccount.address) {
      address = activeAccount.address
    }
    resolve({
      success: true,
      data: address,
      uuid
    })
  }

  /**
   * app send
   */
  private async send(data: SendParms, resolve, uuid: string) {
    console.log('send', this.popupId)
    const approved = await isApproved(data.appName)
    const isHaveWallet = this.service.isHaveWallet
    const isUnlock = this.service.isUnlock
    const res: SendRes = {
      popupExist: !!this.popupId,
      isApproved: approved,
      isHaveWallet,
      isUnlock
    }
    // popup already exist
    if (!approved || !isHaveWallet || !isUnlock || this.popupId) {
      resolve({
        success: false,
        data: res,
        uuid
      })
      return
    }
    // save send data (should be delete after send tx)
    this.service.sendData = {
      ...data,
      uuid
    }
    log.debug('DappSend enter DappSendPage')
    this.service.setAppSate(APP_STATE.DAPP_SEND_PAGE)
    log.debug('DappSend enter DappSendPage')
    await this.openPopup()
    const txHash = this.service.getTxHashByUuid(uuid)
    console.log(txHash, 'txhash')
    if (txHash) {
      resolve({
        success: true,
        data: txHash,
        uuid
      })
    } else {
      res.info = 'send tx failed'
      resolve({
        success: false,
        data: res,
        uuid
      })
    }
  }

  private async openPopup() {
    if (this.popupId) {
      return
    }
    chrome.windows.create(
      {
        url: 'build/index.html',
        type: 'popup',
        width: 360,
        height: 490,
        // left: 25,
        // top: 25
        focused: true
        // state: 'normal',
      },
      window => {
        this.popupId = window.id
      }
    )
    chrome.windows.onFocusChanged.addListener(newWindowId => {
      if (newWindowId > 0 && !!this.popupId && newWindowId !== this.popupId) {
        log.debug(`window change to ${newWindowId}, current popupId is ${this.popupId}`)
        chrome.windows.remove(this.popupId as number)
      }
    })
    chrome.windows.onRemoved.removeListener(this.windowRemoveListener)
    await new Promise(resolve => {
      this.windowRemoveListener = (id: number) => {
        log.debug(`windowRemoveLister: the closed window is ${id}, popup is ${this.popupId}`)
        // console.log('listener', id, this.popupId)
        if (id === this.popupId) {
          this.popupId = undefined
          this.service.setAppStateToHome()
          resolve()
        }
      }
      chrome.windows.onRemoved.addListener(this.windowRemoveListener)
    })
  }

  getAppName = (): string => {
    console.log('appName: ' + this.appName)
    return this.appName
  }
}

export default BackgroundScript

export interface SendParms {
  appName: string
  to: string
  value: string
  extraData: string
  uuid: string
}

export interface SendRes {
  popupExist: boolean
  isApproved: boolean
  isHaveWallet: boolean
  isUnlock: boolean
  info?: string
}

export interface ApproveRes {
  popupExist: boolean
  isHaveWallet: boolean
  isUnlock: boolean
  info?: string
}

export interface IsApprovedRes {
  isApproved: boolean
}

export interface AppproveSuccessRes {
  appName: string
}

export interface SendSuccessParams {
  appName: string
  hash: string
}
