import API from '@/api'
import { action, observable } from 'mobx'
import { TxStatusParams, TransactionObj, SendTxParams } from '@dipperin/lib/models/transaction'
import Consola from 'consola'

const log = Consola.withTag('popup-transactionStore').create({
  level: 5
})
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

  getMinTransactionFee = (tx: SendTxParams) => {
    return this._api.getMinTxFee(tx)
  }

  sendTransaction = (tx: SendTxParams) => {
    return this._api.sendTransaction(tx)
  }

  getAppTx = (): Promise<AppTx> => {
    return this._api.getAppTx() as Promise<AppTx>
  }

  sendTxForApp = (txFee: string) => {
    return this._api.sendTxForApp(txFee)
  }

  verifyTx = (txParam: SendTxParams) => {
    // TODO: add info to constant
    if (!txParam.address) {
      return { success: false, info: "You have to input receiner's address!" }
    } else if (!txParam.amount) {
      return { success: false, info: 'You have to input the amount!' }
    } else if (!txParam.memo) {
      return { success: false, info: 'You have to input the poundage!' }
    } else {
      return { success: true }
    }
  }
  sendAppTx = async (txParam: SendTxParams) => {
    const res = this.verifyTx(txParam)
    const response = {
      success: false,
      info: ''
    }
    if (res.success) {
      try {
        await this.sendTxForApp(txParam.fee as string)
        log.success('Send App Transaction Success!')
        response.success = true
        response.info = 'The transaction has been sent!'
      } catch (err) {
        response.info = 'The transaction has been sent!'
        log.error('Send App Transaction Error:' + err)
        // TODO:
        // response.info = this.translateErrorInfo(err as string)
        response.info = 'Your action is too frequent, please try later.'
      }
    } else {
      response.info = res.info as string
    }
    return response
  }

  translateErrorInfo = (error: string): string => {
    const frequent = [
      'ResponseError: Returned error: "this transaction already in tx pool"',
      'ResponseError: Returned error: "new fee is too low to replace old one"'
    ]
    if (frequent.includes(error)) {
      return 'Your action is too frequent, please try later.'
    }
    return error
  }
}

export default Transaction

interface AppTx {
  appName: string
  to: string
  value: string
  extraData: string
}
