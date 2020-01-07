import EventEmitter from 'eventemitter3'
import BN from 'bignumber.js'
import { isString } from 'lodash'
import Dipperin, { AccountObject, Utils, helper } from '@dipperin/dipperin.js'

import { getTxByAddress, insertTx, updateTxStatus } from '../storage'
import {
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
    // log.debug(`updating transactions status........`)
    if (!this._transactionsMap) {
      return
    }
    for (const transactions of this._transactionsMap.values()) {
      // log.debug(`updating transactions status........`, transactions)
      transactions
        .filter(tx => !tx.isEnded)
        // .filter(tx => !tx.isSuccess && !tx.isOverLongTime(getNowTimestamp()))
        .forEach(tx => {
          const txs = transactions
          this._dipperin.dr
            .getTransaction(tx.transactionHash)
            .then(res => {
              // log.debug(`updateTransactionStatus`, res)
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
            .catch(err => log.error(`updateTransactionStatus`, err))
        })
    }
  }

  async appendTransaction(address: string, txs: TransactionObj[]) {
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

    for (const tx of mTxs) {
      await insertTx(tx.toJS())
    }
    // await mTxs.forEach(async tx => await insertTx(tx.toJS()))
  }

  // address: string, amount: string, memo: string
  // getTransactionFee(activeAccount: AccountModel, tx: SendTxParams): string {
  //   try {
  //     const transaction = this.createNewTransaction(activeAccount, tx)
  //     return transaction.fee
  //   } catch (err) {
  //     return DEFAULT_TX_FEE
  //   }
  // }

  async getEstimateGas(hdAccount: AccountObject, activeAccount: AccountModel, tx: SendTxParams): Promise<string> {
    const privateKey = hdAccount.derivePath(activeAccount.path).privateKey
    try {
      tx.gas = '10000000000000000'
      tx.gasPrice = '1'
      const transaction = this.createNewTransaction(activeAccount, tx)
      transaction.signTranaction(privateKey, DEFAULT_CHAIN_ID)
      const res = await this._dipperin.dr.estimateGas(transaction.signedTransactionData)
      log.debug('getEstimateGas response', res)
      return String(Number(res).toString())
    } catch (err) {
      log.error('getEstimateGas:', err)
      return '0'
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
      log.debug('confirmTransaction-transaction:', transaction)
      transaction.signTranaction(privateKey, DEFAULT_CHAIN_ID)
      log.debug(`confirmTransaction-signedTransaction:`, transaction.signedTransactionData)
      const res = await this._dipperin.dr.sendSignedTransaction(transaction.signedTransactionData)
      log.debug('confirmTransaction response', res)
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
        log.debug('confirmTransaction success')
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
                  from: tx.from,
                  hashLock: tx.hashLock,
                  nonce: tx.nonce,
                  status: tx.status,
                  timeLock: tx.timeLock,
                  timestamp: tx.timestamp,
                  to: tx.to,
                  transactionHash: tx.transactionHash,
                  value: tx.value,
                  gas: tx.gas,
                  gasPrice: tx.gasPrice
                })
            )
          )
        } catch (err) {
          console.error(err)
        }
      })
    )
    for (const account of accounts) {
      const txMs = this._transactionsMap.get(account.address)
      if (!(txMs.length > 0) || Number(txMs[0]!.nonce) > 1) {
        await this.getHistoryTxRecord(account.address)
      }
    }
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

    const gasUnit = tx.gas ? tx.gas : '0'

    const gasPriceUnit = tx.gasPrice ? tx.gasPrice : '1'

    const accountAmount = Utils.toUnit(fromAccount.balance)
    if (new BN(accountAmount).lt(new BN(amountUnit).plus(new BN(tx.gas).times(new BN(gasPriceUnit))))) {
      log.error('createNewTransaction', 'no enough balance')
      throw new Errors.NoEnoughBalanceError()
    }
    log.debug(`createNewTransaction tx:`, tx, `uuid:`, uuid)
    return new TransactionModel({
      nonce: fromAccount.nonce,
      extraData: tx.memo,
      value: amountUnit,
      hashLock: DEFAULT_HASH_LOCK,
      from: fromAccount.address,
      to: tx.address,
      gas: gasUnit,
      gasPrice: gasPriceUnit,
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

  /**
   * get tx record from monitor api
   */
  getHistoryTxRecord = async (address: string) => {
    log.debug(`getHistoryTxRecord`, address)
    const apiUrl = 'http://14.17.65.122:8886/api/v1/account/txs'
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
      const options = {
        method: 'POST',
        headers,
        body: JSON.stringify({ address, page: 1, per_page: 100 })
      }
      const response = await fetch(apiUrl, options)
      const rawJson = await response.text()
      const json = JSON.parse(rawJson)
      log.debug(`get tx records`, json)
      if (!json.success) {
        return
      }
      let txs = json.tx_list.map(tx => {
        return {
          nonce: String(tx.nonce),
          value: tx.amount,
          to: tx.to_address,
          from: tx.from_address,
          extraData: tx.extra_data.length > 2 ? helper.Bytes.toString(tx.extra_data) : '',
          gas: tx.cost.slice(1).replace(/^0*/, ''),
          gasPrice: tx.gasPrice,
          timestamp: Number(tx.timestamp.slice(0, 13)),
          transactionHash: tx.hash,
          uuid: ''
        }
      })
      const txCount = json.total_count
      let curCount = json.tx_list.length
      let curPage = 1
      // set a max loop number
      const loopCount = Math.ceil((txCount * 2) / 100)
      let curLoop = 1
      while (curCount < txCount && curLoop < loopCount) {
        curPage += 1
        const options2 = {
          method: 'POST',
          headers,
          body: JSON.stringify({ address, page: curPage, per_page: 100 })
        }
        const res = await fetch(apiUrl, options2)
        const rJson = await res.text()
        const jsons = JSON.parse(rJson)
        log.debug(`get tx records`, jsons)
        txs = txs.concat(
          jsons.tx_list.map(tx => {
            return {
              nonce: String(tx.nonce),
              value: tx.amount,
              to: tx.to_address,
              from: tx.from_address,
              extraData: tx.extra_data.length > 2 ? helper.Bytes.toString(tx.extra_data) : '',
              gas: tx.cost.slice(1).replace(/^0*/, ''),
              gasPrice: tx.gasPrice,
              timestamp: Number(tx.timestamp.slice(0, 13)),
              transactionHash: tx.hash,
              uuid: ''
            }
          })
        )
        curCount += jsons.tx_list.length
        curLoop += 1
      }
      txs = txs.filter(tx => {
        return !this._transactionsMap.get(address).some(txModel => txModel.transactionHash === tx.transactionHash)
      })
      // console.log(curPage)
      await this.appendTransaction(address, txs)
    } catch (e) {
      log.error(e)
    }
  }
}

export default TransactionStore

export interface TxResponse {
  success: boolean
  info?: string
  hash?: string
}
