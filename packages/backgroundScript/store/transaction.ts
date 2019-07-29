import EventEmitter from 'eventemitter3'
import BN from 'bignumber.js'
import { isString } from 'lodash'
import Dipperin, { AccountObject, Utils } from '@dipperin/dipperin.js'

import { getTxByAddress, insertTx, updateTxStatus } from '../storage'
import {
  DEFAULT_TX_FEE,
  DEFAULT_CHAIN_ID,
  DEFAULT_HASH_LOCK,
  TRANSACTION_STATUS_FAIL,
  TRANSACTION_STATUS_SUCCESS,
  UPDATE_TX_STATUS
} from '@dipperin/lib/constants'
// import AccountStore from './account'

import TransactionModel, { TransactionObj, SendTxParams, TxStatusParams } from '@dipperin/lib/models/transaction'
import AccountModel from '@dipperin/lib/models/account'
import { backgroundLog as log } from '@dipperin/lib/log'
import Errors from '../utils/errors'
import { getNowTimestamp } from '../utils'

class TransactionStore extends EventEmitter {
  private _dipperin: Dipperin

  private _transactionsMap: Map<string, TransactionModel[]> = new Map()

  constructor(dipperin: Dipperin) {
    super()
    this._dipperin = dipperin
  }

  getTransactions(address: string): TransactionModel[] {
    return (this._transactionsMap.get(address) || []).slice().reverse()
  }

  getTxHashByUuid(uuid: string): string | undefined {
    if (!this._transactionsMap) {
      return undefined
    }
    for (const transactions of this._transactionsMap.values()) {
      for (const tx of transactions) {
        if (!tx.uuid) {
          continue
        }
        if (tx.uuid === uuid) {
          return tx.transactionHash
        }
      }
    }

    return undefined
  }

  updateTransactionStatus() {
    if (!this._transactionsMap) {
      return
    }
    for (const transactions of this._transactionsMap.values()) {
      transactions
        // .filter(tx => !tx.isEnded)
        .filter(tx => !tx.isSuccess && !tx.isOverLongTime(getNowTimestamp()))
        .forEach(tx => {
          const txs = transactions
          this._dipperin.dr
            .getTransaction(tx.transactionHash)
            .then(res => {
              if (!res.transaction) {
                if (tx.isOverTime(getNowTimestamp()) || this.haveSameNonceSuccessTx(tx, txs)) {
                  // if (!res) {
                  //   if (tx.isOverTime) {
                  this.updateTxStatus(tx, TRANSACTION_STATUS_FAIL)
                }
                return
              } else {
                // if (res.blockNumber !== 0) {
                //   this.updateTxStatus(tx, TRANSACTION_STATUS_SUCCESS)
                // }
                tx.setSuccess()
                this.updateTxStatus(tx, TRANSACTION_STATUS_SUCCESS)
              }
            })
            .catch(err => console.error(err))
        })
    }
  }

  appendTransaction(address: string, txs: TransactionObj[]) {
    const mTxs = txs.map(tx => {
      return new TransactionModel({
        ...tx,
        hashLock: '',
        status: tx.status ? tx.status : TRANSACTION_STATUS_SUCCESS,
        uuid: tx.uuid
      })
    })

    const preTxs = this._transactionsMap.get(address) || []

    const newTxs = [...preTxs, ...mTxs].sort((tx1, tx2) => tx1.timestamp - tx2.timestamp)

    this._transactionsMap.set(address, newTxs)

    mTxs.forEach(tx => insertTx(tx.toJS()))
  }

  // address: string, amount: string, memo: string
  getTransactionFee(activeAccount: AccountModel, tx: SendTxParams): string {
    try {
      const transaction = this.createNewTransaction(activeAccount, tx)
      return transaction.fee
    } catch (err) {
      return DEFAULT_TX_FEE
    }
  }

  async confirmTransaction(
    hdAccount: AccountObject,
    activeAccount: AccountModel,
    tx: SendTxParams,
    uuid?: string
  ): Promise<TxResponse> {
    const privateKey = hdAccount.derivePath(activeAccount.path).privateKey
    try {
      const transaction = this.createNewTransaction(activeAccount, tx, uuid)
      console.log('confirmTransaction-transaction:', transaction)
      transaction.signTranaction(privateKey, DEFAULT_CHAIN_ID)
      log.debug(`confirmTransaction-signedTransaction: ${transaction.signedTransactionData}`)
      // console.log('confirmTransaction-signedTransaction:', transaction.signedTransactionData)
      // console.debug(`tx${JSON.stringify(transaction.toJS())}`)
      // console.dir(transaction.toJS())
      const res = await this._dipperin.dr.sendSignedTransaction(transaction.signedTransactionData)
      if (!isString(res)) {
        const errRes = res

        return {
          success: false,
          info: errRes.error ? errRes.error.message : 'Something wrong!'
        }
      }
      if (res === transaction.transactionHash) {
        // Append Transaction
        const activeAccountAddress = activeAccount.address
        this.appendTransaction(activeAccountAddress, [transaction.toJS()])
        // Plus account nonce
        activeAccount.plusNonce()
        return {
          success: true,
          hash: transaction.transactionHash
        }
      } else {
        return {
          success: false,
          info: 'Something wrong!'
        }
      }
    } catch (err) {
      // console.error(String(err))
      if (err instanceof Errors.NoEnoughBalanceError) {
        return {
          success: false,
          info: err.message
        }
      }
      return {
        success: false,
        info: String(err)
      }
    }
  }

  // TODO accounts
  async load(accounts: AccountModel[]) {
    await Promise.all(
      accounts.map(async account => {
        const txs = await getTxByAddress(account.address)
        try {
          this._transactionsMap.set(
            account.address,
            txs.map(
              tx =>
                new TransactionModel({
                  extraData: tx.extraData,
                  fee: tx.fee,
                  from: tx.from,
                  hashLock: tx.hashLock,
                  nonce: tx.nonce,
                  status: tx.status,
                  timeLock: tx.timeLock,
                  timestamp: tx.timestamp,
                  to: tx.to,
                  transactionHash: tx.transactionHash,
                  value: tx.value
                })
            )
          )
        } catch (err) {
          console.error(err)
        }
      })
    )
  }

  clear() {
    this._transactionsMap.clear()
  }

  reload(accounts: AccountModel[]) {
    this.clear()
    this.load(accounts)
  }

  private createNewTransaction(activeAccount: AccountModel, tx: SendTxParams, uuid?: string): TransactionModel {
    const fromAccount = activeAccount
    const amountUnit = Utils.toUnit(tx.amount)

    const feeUnit = tx.fee ? Utils.toUnit(tx.fee) : DEFAULT_TX_FEE

    const accountAmount = Utils.toUnit(fromAccount.balance)
    if (new BN(accountAmount).lt(new BN(amountUnit).plus(new BN(feeUnit)))) {
      throw new Errors.NoEnoughBalanceError()
    }
    log.debug(`createNewTransaction，tx: ${tx}, uuid: ${uuid}`)
    // console.log(tx, uuid, 'create')
    return new TransactionModel({
      nonce: fromAccount.nonce,
      extraData: tx.memo,
      value: amountUnit,
      hashLock: DEFAULT_HASH_LOCK,
      from: fromAccount.address,
      to: tx.address,
      fee: feeUnit,
      uuid
    })
  }

  private haveSameNonceSuccessTx(tx: TransactionModel, txs: TransactionModel[]): boolean {
    return txs
      .filter(t => t.isSuccess)
      .some(t => t.from === tx.from && t.nonce === tx.nonce && t.transactionHash !== tx.transactionHash)
  }

  /**
   * update tx status
   * update storage tx status
   * send popup to update status
   * @param tx
   * @param status
   */
  private updateTxStatus(tx: TransactionModel, status: string) {
    if (status === TRANSACTION_STATUS_FAIL) {
      tx.setFail()
    } else {
      tx.setSuccess()
    }
    updateTxStatus(tx.transactionHash, status)
    const params: TxStatusParams = {
      transactionHash: tx.transactionHash,
      status
    }
    this.emit(UPDATE_TX_STATUS, params)
  }
}

export default TransactionStore

export interface TxResponse {
  success: boolean
  info?: string
  hash?: string
}
