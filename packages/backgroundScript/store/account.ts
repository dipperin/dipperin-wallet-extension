import EventEmitter from 'eventemitter3'
import Dipperin, { AccountObject, Utils, Accounts, helper } from '@dipperin/dipperin.js'
import AccountModel, {
  AccountObj,
  AccountBalanceParams,
  AccountLockBalanceParams,
  AccountType
} from '@dipperin/lib/models/account'
import {
  getAccounts,
  addAccount,
  updateAccountInfo,
  deleteAccount,
  setActiveAccountId,
  getActiveAccountId,
  removeAccount
} from '../storage'
import {
  ACCOUNTS_PATH,
  DEFAULT_BALANCE,
  DEFAULT_NAME,
  EMPTY_STRING,
  UPDATE_ACCOUNT_BALANCE,
  NUMBER_ZERO,
  ACCOUNT,
  CHNAGE_ACTIVE_ACCOUNT,
  UPDATE_ACCOUNT_LOCK_BALANCE
} from '@dipperin/lib/constants'
import { backgroundLog as log } from '@dipperin/lib/log'

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

  async initImportAccount(hdAccount: AccountObject) {
    return new Promise(async resolve => {
      const res = this.addAccount(hdAccount, 'account' + String(1))
      if (res) {
        throw res
      }
      const tmp: Map<string, AccountModel> = new Map()
      for (let i = 2; i < 16; i++) {
        tmp.set(String(i), this.generateAccount(hdAccount, String(i), 'account' + String(i)))
      }
      setTimeout(() => {
        for (let i = 2; i < 16; i++) {
          if (tmp.get(String(i)).balance !== '0') {
            this._accountMap.set(String(i), tmp.get(String(i)))
            addAccount(tmp.get(String(i)).toJS())
            this.updateBanlance(String(i))
            this.updateAddressLockMoney(String(i))
          }
        }
        // log.debug('initImportAccount timeout')
        resolve()
      }, 4000)
      // log.debug(tmp)
      for (let i = 2; i < 16; i++) {
        log.debug(i)
        const balance = await this.getAccountBalance(tmp.get(String(i)).address)
        log.debug(i, balance)
        if (balance) {
          tmp.get(String(i)).balance = Utils.fromUnit(balance)
          log.debug(i, 2222)
        }
      }
      // log.debug(tmp,tmp.size)
      for (let i = 15; i > 1; i--) {
        if (tmp.get(String(i)).balance === '0') {
          tmp.delete(String(i))
        } else {
          break
        }
      }
      // log.debug(tmp)
      for (const [key, value] of tmp.entries()) {
        this._accountMap.set(key, value)
        await addAccount(value.toJS())
        this.updateBanlance(key)
        this.updateAddressLockMoney(key)
      }
      // tmp.forEach(async (value, key) => {
      //   this._accountMap.set(key, value)
      //   await addAccount(value.toJS())
      //   this.updateBanlance(key)
      //   this.updateAddressLockMoney(key)
      // })

      if (this._accountMap.get('1').balance === '0') {
        for (let i = 2; i < 16; i++) {
          // const act = this._accountMap.get(String(i))
          const act = this._accountMap.get('1')
          // console.log(i, act.balance)
          if (act && act.balance !== '0') {
            this.changeActiveAccount(String(i))
            break
          }
        }
      }
      // log.debug('initImportAccount finish')
      resolve()
    })

    // the old implementation
    // for (let i = 0; i < 15; i++) {
    //   await this.addAccountAsync(hdAccount, 'account' + String(i + 1))
    //   log.debug('finish create account', i + 1)
    // }
    // this.changeActiveAccount('1')
    // // Turn to the first account that has coins
    // if (this._accountMap.get('1').balance === '0') {
    //   for (let i = 2; i < 16; i++) {
    //     // const act = this._accountMap.get(String(i))
    //     const act = this._accountMap.get('1')
    //     // console.log(i, act.balance)
    //     if (act.balance !== '0') {
    //       this.changeActiveAccount(String(i))
    //       break
    //     }
    //   }
    // }
    // for (let i = 15; i > 1; i--) {
    //   if (this._accountMap.get(String(i)).balance === '0') {
    //     await this.removeAccountAsync(String(i))
    //   } else {
    //     break
    //   }
    // }
  }

  /**
   * derive new account from hdAccount Async
   * @param hdAccount
   * @param name
   */
  async addAccountAsync(hdAccount: AccountObject, name: string = DEFAULT_NAME): Promise<Error | void> {
    try {
      const newId = String(++this._maxId)
      // const newPath = `${ACCOUNTS_PATH}/${newId}`
      // const address = hdAccount.derivePath(newPath).address
      // Add new account
      const newAccount = this.generateAccount(hdAccount, newId, name)
      // Save account
      this._accountMap.set(newId, newAccount)
      // add account to storage
      await addAccount(newAccount.toJS())
      // change active account
      this.changeActiveAccount(newId)
      // setTimeout()
      await this.updateBanlance(newId)
      await this.updateAddressLockMoney(newId)
      log.debug('addAccountAsync finish', name)
    } catch (err) {
      console.log('addAccountAsync', err)
      return err
    }
  }

  private generateAccount(hdAccount: AccountObject, accountId: string, name: string): AccountModel {
    const newPath = `${ACCOUNTS_PATH}/${accountId}`
    const address = hdAccount.derivePath(newPath).address
    const newAccount = this.createAccount(name, address, accountId, newPath)
    return newAccount
  }

  async removeAccountAsync(id: string): Promise<Error | void> {
    try {
      this._accountMap.delete(id)
      await removeAccount(id)
      this._maxId--
    } catch (err) {
      return err
    }
  }

  /**
   * derive new account from hdAccount Sync
   * @param hdAccount
   * @param name
   */
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
      this.updateAddressLockMoney(newId)
    } catch (err) {
      return err
    }
  }

  importAccount(hdAccount: AccountObject, priv: string, name?: string) {
    try {
      const newId = String(++this._maxId)
      const accountName = name || `account${newId}`
      const path = `${ACCOUNTS_PATH}/${0}`
      const psw = hdAccount.derivePath(path).privateKey
      const newAccount = this._getAccountFromPriv(accountName, psw, newId, priv)
      // console.log(newAccount)
      this._accountMap.set(newId, newAccount)
      addAccount(newAccount.toJS())
      this.changeActiveAccount(newId)
      this.updateBanlance(newId)
      this.updateAddressLockMoney(newId)
    } catch (err) {
      throw err
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
        // console.log('get balance', balance)
        this.updateAccountBalance(selectAccount, balance)
      }
    } else {
      for (const account of this._accountMap.values()) {
        const balance = await this.getAccountBalance(account.address)
        this.updateAccountBalance(account, balance)
      }
    }
  }

  private async getAddressLockMoney(address: string): Promise<string> {
    try {
      const res = await this._dipperin.dr.getLockedMoney(address)
      return res || '0'
    } catch (err) {
      // console.log('getAddressLockMoney', err)
      return ''
    }
  }

  private updateAccountLockBalance(account: AccountModel, lockBalance: string) {
    // if (balance !== EMPTY_STRING) {
    const preBalance = account.lockBalance
    account.lockBalance = lockBalance ? Utils.fromUnit(lockBalance) : lockBalance
    if (preBalance !== account.lockBalance) {
      updateAccountInfo(account.id, ACCOUNT.LOCK_BALANCE, account.lockBalance)
      // send to popup new banlance
      const params: AccountLockBalanceParams = {
        id: account.id,
        lockBalance: account.lockBalance
      }
      this.emit(UPDATE_ACCOUNT_LOCK_BALANCE, params)
    }
    // }
  }

  async updateAddressLockMoney(id?: string): Promise<void> {
    // console.log('updateAddressLockMoney start-----------')
    if (id) {
      const selectAccount = this._accountMap.get(id)
      if (selectAccount) {
        const lockMoney = await this.getAddressLockMoney(selectAccount.address)
        this.updateAccountLockBalance(selectAccount, lockMoney)
        // console.log('selectAccount',lockMoney)
      }
    } else {
      for (const account of this._accountMap.values()) {
        const lockMoney = await this.getAddressLockMoney(account.address)
        this.updateAccountLockBalance(account, lockMoney)
        // console.log('account', lockMoney)
      }
    }
    // console.log('updateAddressLockMoney end-------------')
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

  private _getAccountFromPriv(name: string, psw: string, id: string, privateKey: string) {
    const path = `${ACCOUNTS_PATH}/${0}`
    const type = AccountType.privateKey
    const encryptKey = Accounts.encrypt(privateKey, psw)
    const address = helper.Account.fromPrivate(privateKey)
    const accountObj: AccountObj = {
      name,
      address,
      id,
      path,
      balance: DEFAULT_BALANCE,
      type,
      encryptKey
    }
    return new AccountModel(accountObj)
  }

  /**
   * Get account balance from the chain
   * @param address Account Address
   */
  private async getAccountBalance(address: string): Promise<string> {
    // add a time limit
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(EMPTY_STRING)
      }, 4000)
      this._dipperin.dr
        .getBalance(address)
        .then(res => resolve(res || EMPTY_STRING))
        .catch(() => resolve(EMPTY_STRING))
    })
    // old implementation
    // try {
    //   const res = await this._dipperin.dr.getBalance(address)
    //   return res || EMPTY_STRING
    // } catch (err) {
    //   return EMPTY_STRING
    // }
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
    // console.log('format balance', account.balance)
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

  static getAccountPrivate(account: AccountModel, priv: string): string {
    if (account.type === AccountType.hd) {
      return priv
    }

    if (account.type === AccountType.privateKey) {
      const result = Accounts.decrypt(account.encryptKey, priv).seed
      return result
    }

    throw new Error('The account is not standard!')
  }
}

export default Account
