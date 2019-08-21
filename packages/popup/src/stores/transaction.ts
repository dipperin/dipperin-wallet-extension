import API from '@/api'
import { action, observable } from 'mobx'
import { TxStatusParams, TransactionObj, SendTxParams } from '@dipperin/lib/models/transaction'
// import { popupLog as log } from '@dipperin/lib/log'
import { Utils } from '@dipperin/dipperin.js'

class Transaction {
  private _api: API

  @observable
  private _transactionList: TransactionObj[] = []

  constructor(api: API) {
    this._api = api
    this.onUpdateTxStatus()
  }

  @action
  private onUpdateTxStatus = () => {
    this._api.onUpdateStatus((res: TxStatusParams) => {
      this._transactionList.forEach(obj => {
        if (obj.transactionHash === res.transactionHash) {
          obj.status = res.status
        }
      })
    })
  }

  // getMinTransactionFee = (tx: SendTxParams) => {
  //   return this._api.getMinTxFee(tx)
  // }

  getEstimateGas = (tx: SendTxParams) => {
    return this._api.getEstimateGas(tx)
  }

  getTransactions = (address: string) => {
    return this._api.getTransaction(address)
  }

  sendTransaction = (tx: SendTxParams) => {
    return this._api.sendTransaction(tx)
  }

  getAppTx = (): Promise<AppTx> => {
    return this._api.getAppTx() as Promise<AppTx>
  }

  sendTxForApp = (tx: SendTxParams) => {
    return this._api.sendTxForApp(tx)
  }

  verifyBalance = (tx: SendTxParams) => {
    const accountBalance = this._api.store.account.activeAccount.balance
    const fee = tx.gas && tx.gasPrice ? Number(tx.gasPrice) * Number(tx.gas) : 0
    return Number(accountBalance) >= Number(Utils.fromUnit(String(fee))) + Number(tx.amount)
  }

  verifyTx = (txParam: SendTxParams) => {
    // TODO: add info to constant
    const label = this._api.store.label.label
    if (!txParam.address) {
      return { success: false, info: label.send.errorAddress }
    } else if (!txParam.amount) {
      return { success: false, info: label.send.errorAmount }
    } else if (!this.verifyBalance(txParam)) {
      return { success: false, info: label.send.errorBalance }
    } else {
      return { success: true }
    }
  }
}

export default Transaction

interface AppTx {
  appName: string
  to: string
  value: string
  extraData: string
}
