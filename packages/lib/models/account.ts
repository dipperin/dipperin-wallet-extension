import BigNumber from 'bignumber.js'
import { DEFAULT_NONCE } from '../constants'
class Account {
  private _name: string
  private _address: string
  private _id: string
  private _path: string
  private _balance: string
  private _nonce: string = DEFAULT_NONCE

  constructor(account: AccountObj) {
    this._name = account.name
    this._address = account.address
    this._id = account.id
    this._path = account.path
    this._balance = account.balance
  }

  set name(name: string) {
    this._name = name
  }

  get name(): string {
    return this._name
  }

  get address(): string {
    return this._address
  }

  get id(): string {
    return this._id
  }

  get path(): string {
    return this._path
  }

  get nonce(): string {
    return this._nonce
  }

  set nonce(nonce: string) {
    if (nonce !== '') {
      this._nonce = nonce
    }
  }

  get balance(): string {
    return this._balance
  }

  // FIXME: balance should have been fromartted  (Utils.fromUnit(balance))
  set balance(balance: string) {
    if (balance !== '') {
      this._balance = balance
    }
  }

  plusNonce() {
    this._nonce = new BigNumber(this._nonce).plus(1).toString(10)
  }

  toJS(): AccountObj {
    return {
      name: this._name,
      address: this._address,
      id: this._id,
      path: this._path,
      balance: this._balance
    }
  }
}

export default Account

export interface AccountObj {
  name: string
  address: string
  id: string
  path: string
  balance: string
}

export interface AccountBalanceParams {
  id: string
  balance: string
}

export interface AccountNameParams {
  id: string
  name: string
}
