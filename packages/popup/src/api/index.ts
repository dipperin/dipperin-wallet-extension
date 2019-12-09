import { PopupType } from '@dipperin/lib/duplex'
import {
  GET_APP_STATE,
  SET_APP_STATE,
  IMPORT_WALLET,
  CREATE_WALLET,
  SET_PASSWORD,
  GET_MNEMONIC,
  UNLOCK_WALLET,
  GET_ACCOUNTS,
  ADD_ACCOUNT,
  DELETE_ACCOUNT,
  GET_ACTIVE_ACCOUNT,
  CHANGE_ACTIVE_ACCOUNT,
  // GET_MIN_TRANSACTION_FEE,
  SEND_TRANSACTION,
  GET_TRANSACTIONS,
  UPDATE_TX_STATUS,
  POPUP_GET_APP_STATE,
  RESET_WALLET,
  UPDATE_ACCOUNT_NAME,
  APP_APPROVE,
  GET_APP_TX,
  APP_SEND,
  CHANGE_NET,
  GET_CURRENT_NET,
  GET_APP_NAME,
  GET_ESTIMATE_GAS,
  GET_PRIVATE_KEY,
  IMPORT_PRIVATE_KEY,
  GET_SIGNING_MESSAGE,
  CONFIRM_SIGN_MESSAGE
} from '@dipperin/lib/constants'
import { popupLog as log } from '@dipperin/lib/log'
import { SendTxParams } from '@dipperin/lib/models/transaction'
import { AccountNameParams } from '@dipperin/lib/models/account'
import Root from '../stores/root'

class API {
  private duplex: PopupType
  store: Root

  constructor(duplex: PopupType, root: Root) {
    this.duplex = duplex
    this.store = root
  }

  /** for history store  */

  getCurrentPage = () => {
    // return this.duplex.send('popup:getCurrentPage', {})
    return this.duplex.send(GET_APP_STATE, {}, true)
  }

  setAppState = (appState: number) => {
    this.duplex.send(SET_APP_STATE, appState, false)
  }

  onAppState = (cb: (res: any) => void) => {
    this.duplex.on(POPUP_GET_APP_STATE, cb)
  }

  /** for wallet store  */

  importWallet = (password: string, mnemonic: string) => {
    return this.duplex.send(IMPORT_WALLET, { password, mnemonic }, true)
  }

  setPassword = (password: string) => {
    return this.duplex.send(SET_PASSWORD, password, true)
  }

  getMnemonic = () => {
    return this.duplex.send(GET_MNEMONIC, '', true)
  }

  createWallet = () => {
    return this.duplex.send(CREATE_WALLET, '', true)
  }

  unlockWallet = (password: string) => {
    return this.duplex.send(UNLOCK_WALLET, password, true)
  }

  resetWallet = () => {
    this.duplex.send(RESET_WALLET, '', false)
  }

  confirmAuth = () => {
    // TODO:
    // return Promise.resolve()
    return this.duplex.send(APP_APPROVE, '')
  }

  getCurrentNet = () => {
    log.debug(`_api get current net`)
    return this.duplex.send(GET_CURRENT_NET, '')
  }

  changeNet = (remoteNode: string) => {
    log.debug(`_api change net to ${remoteNode}`)
    this.duplex.send(CHANGE_NET, remoteNode)
  }

  getAppName = () => {
    log.debug(`_api getAppName`)
    return this.duplex.send(GET_APP_NAME, '', true)
  }

  getPrivateKey = (password: string): Promise<string> => {
    return this.duplex.send(GET_PRIVATE_KEY, password, true) as any
  }

  /** for account store  */

  getAccounts = () => {
    return this.duplex.send(GET_ACCOUNTS, '', true)
  }

  getActiveAccount = () => {
    return this.duplex.send(GET_ACTIVE_ACCOUNT, '', true)
  }

  changeActiveAccount = (accountId: string) => {
    return this.duplex.send(CHANGE_ACTIVE_ACCOUNT, accountId, true)
  }

  addAccount = (name: string) => {
    return this.duplex.send(ADD_ACCOUNT, name, true)
  }

  deleteAccount = (id: string) => {
    this.duplex.send(DELETE_ACCOUNT, id, false)
  }

  updateAccountName = (param: AccountNameParams) => {
    return this.duplex.send(UPDATE_ACCOUNT_NAME, param)
  }

  importAccount = (priv: string): Promise<boolean> => {
    return this.duplex.send(IMPORT_PRIVATE_KEY, priv, true) as any
  }

  /** for transaction store  */
  // getMinTxFee = (tx: SendTxParams) => {
  //   return this.duplex.send(GET_MIN_TRANSACTION_FEE, tx, true)
  // }

  getEstimateGas = (tx: SendTxParams) => {
    return this.duplex.send(GET_ESTIMATE_GAS, tx, true)
  }

  sendTransaction = (tx: SendTxParams) => {
    return this.duplex.send(SEND_TRANSACTION, tx, true)
  }

  getTransaction = (address: string) => {
    return this.duplex.send(GET_TRANSACTIONS, address, true)
  }

  onUpdateStatus = (cb: (res: any) => void) => {
    this.duplex.on(UPDATE_TX_STATUS, cb)
  }

  /**
   * get app tx data
   */
  getAppTx = () => {
    return this.duplex.send(GET_APP_TX, '', true)
  }

  /**
   * send tx for app
   */
  sendTxForApp = (tx: SendTxParams) => {
    return this.duplex.send(APP_SEND, tx, true)
  }

  getSignMessage = () => {
    return this.duplex.send(GET_SIGNING_MESSAGE, '', true)
  }

  confirmSignMessage = () => {
    return this.duplex.send(CONFIRM_SIGN_MESSAGE, '', false)
  }

  /** EventListener */
  addEventListener = (name: string, cb: (res: any) => void) => {
    this.duplex.on(name, cb)
  }
}

export default API

export type ApiType = InstanceType<typeof API>
