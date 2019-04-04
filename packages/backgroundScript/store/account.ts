import EventEmitter from 'eventemitter3'
import Dipperin, { AccountObject, Utils } from '@dipperin/dipperin.js'
import AccountModel, { AccountObj, AccountBalanceParams } from '@dipperin/lib/models/account'
import {
  getAccounts,
  addAccount,
  updateAccountInfo,
  deleteAccount,
  setActiveAccountId,
  getActiveAccountId
} from '../storage'
import {
  ACCOUNTS_PATH,
  DEFAULT_BALANCE,
  DEFAULT_NAME,
  EMPTY_STRING,
  UPDATE_ACCOUNT_BALANCE,
  NUMBER_ZERO,
  ACCOUNT,
  CHNAGE_ACTIVE_ACCOUNT
} from '@dipperin/lib/constants'
class Account extends EventEmitter {
  private _activeAccount!: AccountModel
  private _accountMap: Map<string, AccountModel> = new Map()
  private _maxId: number = NUMBER_ZERO
  private _dipperin: Dipperin

  constructor(dipperin: Dipperin) {
    super()
    this._dipperin = dipperin
  }

  get activeAccount(): AccountModel {
    return this._activeAccount
  }

  get accounts(): AccountModel[] {
    const accounts: AccountModel[] = []
    for (const account of this._accountMap.values()) {
      accounts.push(account)
    }
    return accounts
  }

  /**
   * load accounts from cache
   */
  async load() {
    const accounts = await getAccounts()
    accounts.forEach(account => {
      this._accountMap.set(account.id, new AccountModel(account))
      this.updateMaxid(account.id)
    })
    const activeId = await getActiveAccountId()
    this.changeActiveAccount(activeId)
  }

  initAccount(hdAccount: AccountObject) {
    this.addAccount(hdAccount)
  }

  addAccount(hdAccount: AccountObject, name: string = DEFAULT_NAME): Error | void {
    try {
      const newId = String(++this._maxId)
      const newPath = `${ACCOUNTS_PATH}/${newId}`
      const address = hdAccount.derivePath(newPath).address
      // Add new account
      const newAccount = this.createAccount(name, address, newId, newPath)
      // Save account
      this._accountMap.set(newId, newAccount)
      // add account to storage
      addAccount(newAccount.toJS())
      // change active account
      this.changeActiveAccount(newId)
      this.updateBanlance(newId)
    } catch (err) {
      return err
    }
  }

  updateAccountName(id: string, name: string) {
    const account = this._accountMap.get(id)
    if (account) {
      account.name = name
      updateAccountInfo(id, ACCOUNT.NAME, name)
    }
  }

  deleteAccount(id: string) {
    this._accountMap.delete(id)
    deleteAccount(id)
  }

  changeActiveAccount(id: string) {
    const newActiveAccount = this._accountMap.get(id)
    if (newActiveAccount) {
      this._activeAccount = newActiveAccount
      setActiveAccountId(this._activeAccount.id)
      this.emit(CHNAGE_ACTIVE_ACCOUNT, this._activeAccount.address)
    }
  }

  async updateBanlance(id?: string) {
    if (id) {
      const selectAccount = this._accountMap.get(id)
      if (selectAccount) {
        const balance = await this.getAccountBalance(selectAccount.address)
        this.updateAccountBalance(selectAccount, balance)
      }
    } else {
      for (const account of this._accountMap.values()) {
        const balance = await this.getAccountBalance(account.address)
        this.updateAccountBalance(account, balance)
      }
    }
  }

  async updateNonce(id?: string) {
    if (id) {
      const selectAccount = this._accountMap.get(id)
      if (selectAccount) {
        selectAccount.nonce = await this.getAccountNonce(selectAccount.address)
      }
    } else {
      for (const account of this._accountMap.values()) {
        account.nonce = await this.getAccountNonce(account.address)
      }
    }
  }

  clear() {
    this._accountMap.clear()
    this._maxId = NUMBER_ZERO
  }

  /**
   * update max id in all accounts
   * @param id
   */
  private updateMaxid(id: string) {
    const numId = Number(id)
    this._maxId = numId > this._maxId ? numId : this._maxId
  }

  /**
   * create new account
   */
  private createAccount(name: string, address: string, id: string, path: string) {
    const accountObj: AccountObj = {
      name,
      address,
      id,
      path,
      balance: DEFAULT_BALANCE
    }
    return new AccountModel(accountObj)
  }

  /**
   * Get account balance from the chain
   * @param address Account Address
   */
  private async getAccountBalance(address: string): Promise<string> {
    try {
      const res = await this._dipperin.dr.getBalance(address)
      return res || EMPTY_STRING
    } catch (err) {
      return EMPTY_STRING
    }
  }

  /**
   * Get account nonce from the chain
   * @param address Account Address
   */
  private async getAccountNonce(address: string): Promise<string> {
    try {
      const res = await this._dipperin.dr.getNonce(address)
      return res || EMPTY_STRING
    } catch (err) {
      return EMPTY_STRING
    }
  }

  /**
   * update account map balance and update storage balance
   */
  private updateAccountBalance(account: AccountModel, balance: string) {
    // if (balance !== EMPTY_STRING) {
    const preBalance = account.balance
    account.balance = balance ? Utils.fromUnit(balance) : balance
    if (preBalance !== account.balance) {
      updateAccountInfo(account.id, ACCOUNT.BALANCE, account.balance)
      // send to popup new banlance
      const params: AccountBalanceParams = {
        id: account.id,
        balance: account.balance
      }
      this.emit(UPDATE_ACCOUNT_BALANCE, params)
    }
    // }
  }
}

export default Account
