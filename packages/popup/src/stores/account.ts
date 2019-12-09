import { observable, computed, action } from 'mobx'

import { ApiType } from '@/api'
import { AccountObj, AccountNameParams } from '@dipperin/lib/models/account'
import { TEST_NET, UPDATE_ACCOUNT_BALANCE, UPDATE_ACCOUNT_LOCK_BALANCE } from '@dipperin/lib/constants'

class Account {
  @observable
  private _accountList: AccountObj[] = []

  @observable
  private _useNet: string = TEST_NET

  @observable
  private _activeAccountId: string

  private _api: ApiType

  constructor(api: ApiType) {
    this._api = api
    this.onUpdateAccountBalance()
    this.onUpdateAccountLockBalance()
  }

  @computed
  get accountList() {
    return this._accountList
  }

  @computed
  get useNet() {
    return this._useNet
  }

  @computed
  get activeAccount() {
    let res = this._accountList.find(obj => obj.id === this._activeAccountId)
    if (!res) {
      res = {
        name: '',
        address: '',
        id: this._activeAccountId,
        path: '',
        balance: '',
        lockBalance: ''
      }
    }
    return res
  }

  @action
  getAccountInfo = () => {
    this._api.getAccounts()!.then((res: AccountObj[]) => {
      // console.log('accountStore-getAccountInfo:', res)
      this._accountList = res
    })
  }

  @action
  getActiveAccount = () => {
    this._api.getActiveAccount()!.then((res: AccountObj) => {
      // console.log('accountStore-getActiveAccount', res)
      this._activeAccountId = res.id
    })
  }

  @action
  changeCurrentAccount = (accountId: string) => {
    this._api.changeActiveAccount(accountId)
    this._activeAccountId = accountId
  }

  @action
  private onUpdateAccountBalance = () => {
    this._api.addEventListener(UPDATE_ACCOUNT_BALANCE, res => {
      const { id, balance } = res
      this._accountList.forEach(obj => {
        if (obj.id === id) {
          obj.balance = balance
        }
      })
    })
  }

  private onUpdateAccountLockBalance = () => {
    this._api.addEventListener(UPDATE_ACCOUNT_LOCK_BALANCE, res => {
      const { id, lockBalance } = res
      this._accountList.forEach(obj => {
        if (obj.id === id) {
          obj.lockBalance = lockBalance
        }
      })
    })
  }

  addAccount = (name: string) => {
    return this._api.addAccount(name)
  }

  updateAccountName = (param: AccountNameParams) => {
    return this._api.updateAccountName(param)
  }

  updateAccountStore = () => {
    this.getAccountInfo()
    this.getActiveAccount()
  }

  getPrivateKey = (password: string): Promise<string> => {
    return this._api.getPrivateKey(password)
  }

  importPrivateKey = (privateKey: string): Promise<boolean> => {
    return this._api.importAccount(privateKey)
  }
}

export default Account
