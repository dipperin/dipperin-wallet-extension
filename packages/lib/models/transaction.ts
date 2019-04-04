import { Accounts, Utils } from '@dipperin/dipperin.js'
import {
  TRANSACTION_LIMIT_TIME,
  TRANSACTION_STATUS_FAIL,
  TRANSACTION_STATUS_PENDING,
  TRANSACTION_STATUS_SUCCESS
} from '@dipperin/lib/constants'

export default class TransactionModel {
  private _signedTransactionData!: string
  private _transactionHash!: string
  private _fee: string
  private _status: string
  private _timestamp!: number

  private _nonce: string
  private _value: string
  private _hashLock: string
  private _to: string
  private _from: string
  private _extraData?: string
  private _timeLock: number
  private _uuid?: string

  constructor(transaction: TransactionObj) {
    const {
      nonce,
      value,
      from,
      to,
      extraData,
      timeLock,
      status,
      hashLock,
      transactionHash,
      fee,
      timestamp,
      uuid
    } = transaction

    this._nonce = nonce
    this._value = value
    this._hashLock = hashLock
    this._to = to
    this._from = from
    this._extraData = extraData
    this._timeLock = timeLock || 0
    this._status = status || TRANSACTION_STATUS_PENDING

    if (transactionHash) {
      this._transactionHash = transactionHash as string
    }

    if (fee && fee !== '0') {
      this._fee = fee
    } else {
      this._fee = Accounts.getTransactionFee({
        extraData,
        fee: '0',
        hashLock,
        nonce,
        timeLock,
        to,
        value
      })
    }

    if (timestamp) {
      this._timestamp = timestamp
    }
    if (uuid) {
      this._uuid = uuid
    }
  }

  get uuid() {
    return this._uuid
  }

  get nonce() {
    return this._nonce
  }

  get value() {
    return Utils.fromUnit(this._value)
  }

  get to() {
    return this._to
  }

  get from() {
    return this._from
  }

  get hashLock() {
    return this._hashLock
  }

  get extraData() {
    return this._extraData
  }

  get timeLock() {
    return this._timeLock
  }

  get timestamp() {
    return this._timestamp
  }

  get signedTransactionData() {
    return this._signedTransactionData
  }

  get transactionHash() {
    return this._transactionHash
  }

  get fee() {
    return Utils.fromUnit(this._fee)
  }

  get status() {
    return this._status
  }

  get isEnded(): boolean {
    return this._status !== TRANSACTION_STATUS_PENDING
  }

  get isSuccess(): boolean {
    return this._status === TRANSACTION_STATUS_SUCCESS
  }

  isOverTime(now: number): boolean {
    return now - this._timestamp > TRANSACTION_LIMIT_TIME
  }

  isOverLongTime(now: number): boolean {
    return now - this._timestamp > TRANSACTION_LIMIT_TIME * 10
  }

  setSuccess() {
    this._status = TRANSACTION_STATUS_SUCCESS
  }

  setFail() {
    this._status = TRANSACTION_STATUS_FAIL
  }

  signTranaction(privateKey: string, chainId?: string) {
    if (this._signedTransactionData) {
      return
    }
    const signedTransaction = Accounts.signTransaction(
      {
        extraData: this.extraData,
        fee: this._fee,
        hashLock: this._hashLock,
        nonce: this._nonce,
        timeLock: this.timeLock,
        to: this._to,
        value: this._value,
        from: this._from
      },
      privateKey,
      chainId
    )
    this._signedTransactionData = signedTransaction.raw
    this._transactionHash = signedTransaction.hash
    this._timestamp = new Date().valueOf()
  }

  toJS(): TransactionObj {
    return {
      extraData: this._extraData,
      fee: this._fee,
      from: this._from,
      hashLock: this._hashLock,
      nonce: this._nonce,
      status: this._status,
      timeLock: this._timeLock,
      timestamp: this._timestamp,
      to: this._to,
      transactionHash: this._transactionHash,
      value: this._value,
      uuid: this._uuid
    }
  }
}

export interface TransactionObj {
  nonce: string
  value: string
  hashLock: string
  to: string
  from: string
  extraData?: string
  fee?: string
  status?: string
  timeLock?: number
  timestamp?: number
  transactionHash?: string
  uuid?: string
}

export interface SendTxParams {
  address: string
  amount: string
  memo: string
  fee?: string
}

export interface TxStatusParams {
  transactionHash: string
  status: string
}
