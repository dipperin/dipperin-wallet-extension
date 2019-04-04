import EventEmitter from 'eventemitter3'
import Dipperin from '@dipperin/dipperin.js'
import Consola from 'consola'
import {
  // HOST,
  APP_STATE,
  SEND_APP_STATE,
  UPDATE_ACCOUNT_BALANCE,
  UPDATE_TX_STATUS,
  AUTO_LOCK_WALLET,
  TIMER,
  CHANGE_ACTIVE_ACCOUNT,
  CHNAGE_ACTIVE_ACCOUNT,
  SEND_SUCCESS,
  NET_HOST_OBJ,
  REMOTE_MECURY
  // REMOTE_TEST
} from '@dipperin/lib/constants'
import WalletStore from '../store/wallet'
import AccountStore from '../store/account'
import TimerStore from '../store/timer'
import TxStore from '../store/transaction'
import { AccountObj, AccountBalanceParams, AccountNameParams } from '@dipperin/lib/models/account'
import { TxStatusParams, TransactionObj, SendTxParams } from '@dipperin/lib/models/transaction'
import { ImportParams } from '@dipperin/lib/models/wallet'
import { clear } from '../storage'
import { SendParms } from '../backgroundScript'

const log = Consola.withTag('background-script').create({
  level: 5
})

class RootStore extends EventEmitter {
  sendData?: SendParms // app send tx data (appName & tx)
  private _isConnecting: boolean = false
  private _appState: number = APP_STATE.HAS_NO_WALLET
  private _currentNet: string = REMOTE_MECURY
  private _dipperin: Dipperin
  private _wallet: WalletStore
  private _account: AccountStore
  private _tx: TxStore
  private _disconnectTimestamp: number
  private _timer: TimerStore
  private _interval: NodeJS.Timeout
  constructor() {
    super()
    const net = this._currentNet
    this._dipperin = new Dipperin(NET_HOST_OBJ[net])
    this._timer = new TimerStore()
    this._wallet = new WalletStore()
    this._account = new AccountStore(this.dipperin)
    this._tx = new TxStore(this.dipperin)
    this.load()
    this.registerEvent()
    this.startCheckIsConnecting()
  }
  get dipperin() {
    return this._dipperin
  }

  get appState() {
    return this._appState
  }
  get isHaveWallet(): boolean {
    return this._wallet.isHaveWallet
  }

  get isUnlock(): boolean {
    return this._wallet.isUnlock
  }

  get activeAccount() {
    return this._account.activeAccount
  }
  async load() {
    const res = await this._wallet.load()
    this.initAppState()
    console.log(this._appState, 'load')
    if (res) {
      await this._account.load()
      // FIXME: if account can be deleted or net changed, tx should be reloaded after adding an account
      await this._tx.load(this._account.accounts)
      this.startUpdate()
    }
  }

  async getCurrentBlock(): Promise<number> {
    const res = await this._dipperin.dr.getCurrentBlock()
    console.log(res)
    return res
  }

  setAppStateToHome() {
    this._appState = APP_STATE.ACCOUNT_PAGE
  }

  /***** service start */
  /**
   * judge whether is timeout, init app state and lock wallet when timeout
   */
  checkTimeout() {
    if (this._disconnectTimestamp) {
      const nowTimeStamp = new Date().valueOf()
      const timeDiff = nowTimeStamp - this._disconnectTimestamp
      if (timeDiff > AUTO_LOCK_WALLET) {
        console.log('lock', AUTO_LOCK_WALLET)
        clearInterval(this._interval)
        this._wallet.lockWallet()
        this.initAppState()
      }
    }
  }

  /**
   * set the timestamp of pupup disconnect
   */
  popupDisconnect() {
    clearInterval(this._interval)
    if (this._wallet.isHaveWallet) {
      this._disconnectTimestamp = new Date().valueOf()
      this._interval = (setInterval(this.checkTimeout.bind(this), 1000) as any) as NodeJS.Timeout
    }
  }

  /**
   * popup conect
   */
  popupConnect() {
    if (this.isHaveWallet && this.isUnlock) {
      clearInterval(this._interval)
    }
    this.initAppState()
  }

  /**
   * get app state
   */
  getAppState(): number {
    return this._appState
  }

  /**
   * set app state
   */
  setAppSate(state: number) {
    this._appState = state
    this.emit(SEND_APP_STATE, state)
  }

  /**
   *
   * @param password
   */
  setPassword(password: string): Promise<string> | void {
    try {
      this._wallet.create(password)
    } catch (_) {
      return Promise.reject('Something wrong')
    }
  }

  /**
   * get mnemonic
   */
  getMenmonic(): string | Promise<string> {
    const mnemonic = this._wallet.mnemonic
    if (mnemonic) {
      return mnemonic
    }
    return Promise.reject('Something wrong')
  }

  /**
   * create wallet
   */
  createWallet(): Promise<string> | void {
    const destroyMnemonic = this._wallet.destroyMnemonic
    if (!destroyMnemonic) {
      return Promise.reject('Something wrong')
    }
    const res = destroyMnemonic()
    if (res) {
      return Promise.reject(res.message)
    }
    // start update after create wallet success
    this.startUpdate()
    this._account.initAccount(this._wallet.hdAccount)
  }

  /**
   * import wallet
   */
  importWallet(params: ImportParams): Promise<string> | void {
    const res = this._wallet.create(params.password, params.mnemonic)
    if (res) {
      return Promise.reject(res.message)
    }
    // start update after import wallet success
    this.startUpdate()
    this._account.initAccount(this._wallet.hdAccount)
  }

  /**
   * unlock wallet
   */
  unlockWallet(password: string): Promise<string> | void {
    const res = this._wallet.unlockWallet(password)
    if (!res) {
      return Promise.reject('Invalid password!')
    }
    // clear check timeout interval after unlock wallet
    this._disconnectTimestamp = 0
    clearInterval(this._interval)
  }

  /**
   * get Accounts
   */
  getAccounts(): AccountObj[] {
    const accounts = this._account.accounts
    return accounts.map(account => account.toJS())
  }

  /**
   * get active account
   * @param name
   */
  getActiveAccount(): AccountObj | Promise<void> {
    const activeAccount = this._account.activeAccount
    return activeAccount ? activeAccount.toJS() : Promise.reject()
  }

  /**
   * add Account
   */
  addAcount(name: string): Promise<string> | void {
    if (!this._wallet.isHaveWallet) {
      return Promise.reject('Something wrong!')
    }
    const err = this._account.addAccount(this._wallet.hdAccount, name)
    if (err) {
      return Promise.reject(err.message)
    }
  }

  /**
   * change active account
   * @param id
   */
  changeActiveAccount(id: string) {
    this._account.changeActiveAccount(id)
    this._tx.reload(this._account.accounts)
  }

  updateAccountName(params: AccountNameParams) {
    this._account.updateAccountName(params.id, params.name)
  }

  /**
   * delete account
   */
  deleteAccount(id: string): void {
    this._account.deleteAccount(id)
  }

  /**
   * get min tx fee
   * @param tx: address, amount, memo
   */
  getMinTxFee(tx: SendTxParams): string {
    return this._tx.getTransactionFee(this._account.activeAccount, tx)
  }

  /**
   *
   * @param tx: address, amount, memo, tx
   */
  async sendTx(tx: SendTxParams): Promise<string | void> {
    const res = await this._tx.confirmTransaction(this._wallet.hdAccount, this._account.activeAccount, tx)
    if (!res.success) {
      return Promise.reject(res.info)
    }
  }

  /**
   * app send tx
   */
  async appSendTx(txFee: string): Promise<string | void> {
    const tx: SendTxParams = {
      address: this.sendData.to,
      amount: this.sendData.value,
      memo: this.sendData.extraData,
      fee: txFee
    }
    const res = await this._tx.confirmTransaction(
      this._wallet.hdAccount,
      this._account.activeAccount,
      tx,
      this.sendData.uuid
    )
    console.log(res, 'service, res')
    if (!res.success) {
      return Promise.reject(res.info)
    }
    // send app tx hash
    // this.emit(SEND_SUCCESS, { appName: this.sendData, hash: res.hash })
    // close popup
    this.emit(SEND_SUCCESS)
    // reset sendData
    this.sendData = undefined
    this.setAppStateToHome()
  }

  /**
   * get txs by account address
   */
  getTxs(address: string): TransactionObj[] {
    const txs = this._tx.getTransactions(address)
    return txs.map(tx => tx.toJS())
  }

  /**
   * reset wallet
   */
  resetWallet() {
    this.clear()
    this.setAppSate(APP_STATE.HAS_NO_WALLET)
  }

  /***** service end */

  /***** send to popup service start */

  /**
   * update account banlance
   */
  updateAccountbalance = (params: AccountBalanceParams) => {
    this.emit(UPDATE_ACCOUNT_BALANCE, params)
  }

  /**
   * update tx status
   */
  updateTxStatus = (params: TxStatusParams) => {
    this.emit(UPDATE_TX_STATUS, params)
  }

  /***** send to popup service end */

  /** send to pagehook start */
  /**
   * change active account
   */
  sendToPageAccountChange(address: string) {
    this.emit(CHNAGE_ACTIVE_ACCOUNT, address)
  }

  /** send to pagehook end */

  /**
   * get tx by uuid (app send tx)
   */
  getTxHashByUuid(uuid: string) {
    return this._tx.getTxHashByUuid(uuid)
  }

  /**
   * init app state
   */
  private initAppState() {
    if (this._wallet.isHaveWallet && !this._wallet.isUnlock) {
      this.setAppSate(APP_STATE.LOCKED_WALLET)
    }
  }

  /**
   * start update tx status
   * start update account balance & nonce interval
   */
  private startUpdate() {
    // account start update
    this._account.updateBanlance()
    this._account.updateNonce()
    this._timer.asyncOn(TIMER.UPDATE_BALANCE, this._account.updateBanlance.bind(this._account), 5000)
    this._timer.asyncOn(TIMER.UPDATE_NONCE, this._account.updateNonce.bind(this._account), 30000)
    // tx start update
    this._tx.updateTransactionStatus()
    this._timer.asyncOn(TIMER.UPDATE_TX_STATUS, this._tx.updateTransactionStatus.bind(this._account), 5000)
  }

  /**
   * stop update
   */
  private stopUpdate() {
    this._timer.stopUpdate()
  }

  /**
   * register Event
   */
  private registerEvent() {
    this._account.on(UPDATE_ACCOUNT_BALANCE, this.updateAccountbalance.bind(this))
    this._tx.on(UPDATE_TX_STATUS, this.updateTxStatus.bind(this))
    // to pagehook
    this._account.on(CHANGE_ACTIVE_ACCOUNT, this.sendToPageAccountChange.bind(this))
  }

  /**
   * reset wallet
   */
  private clear() {
    this.stopUpdate()
    this._wallet.clear()
    this._account.clear()
    this._tx.clear()
    // clear storage
    clear()
  }

  getCurrentNet = () => {
    return this._currentNet
  }

  async reload() {
    // const res = await this._wallet.load()
    // this.initAppState()
    // console.log(this._appState, 'load')
    await this._wallet.load()
    await this._account.load()
    // FIXME: if account can be deleted or net changed, tx should be reloaded after adding an account
    await this._tx.load(this._account.accounts)
    this.startUpdate()
    // }
  }
  /**
   * change net
   */
  changeNet = (remoteNet: string): void => {
    this._currentNet = remoteNet
    const newHost = NET_HOST_OBJ[remoteNet]
    log.debug(`Change net to ${newHost}`)
    this._dipperin = new Dipperin(newHost)

    this._timer.clear()
    this._tx.clear()

    this._timer = new TimerStore()
    this._wallet = new WalletStore()
    this._account = new AccountStore(this.dipperin)
    this._tx = new TxStore(this.dipperin)
    this.reload()
    this.registerEvent()
    this.startCheckIsConnecting()

    log.debug('Change net to ' + newHost)
  }

  private startCheckIsConnecting() {
    this._timer.on(TIMER.CHECK_IS_CONNECTING, this.checkIsConnecting.bind(this), 5000)
  }

  private checkIsConnecting() {
    this._dipperin.net
      .isConnecting()
      .then(res => {
        const preIsConnecting = this._isConnecting
        if (!res) {
          this._isConnecting = false
          this.stopUpdate()
        } else {
          this._isConnecting = true
          if (!preIsConnecting) {
            this.startUpdate()
          }
        }
      })
      .catch(err => {
        log.debug(err)
        this._isConnecting = false
      })
  }
}

export default RootStore

export interface IsApprovedRes {
  isApproved: boolean
}
