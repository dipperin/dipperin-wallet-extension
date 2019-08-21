import { HostType } from '@dipperin/lib/duplex'
import {
  POPUP_GET_APP_STATE,
  UPDATE_ACCOUNT_BALANCE,
  UPDATE_TX_STATUS,
  APPROVE_SUCCESS,
  CHANGE_ACTIVE_ACCOUNT,
  SEND_SUCCESS,
  UPDATE_ACCOUNT_LOCK_BALANCE
} from '@dipperin/lib/constants'
import { AccountBalanceParams, AccountLockBalanceParams } from '@dipperin/lib/models/account'
import { TxStatusParams } from '@dipperin/lib/models/transaction'
import { AppproveSuccessRes, SendSuccessParams } from '../backgroundScript'
class BackgroundAPI {
  duplex: HostType
  constructor(duplex: HostType) {
    this.duplex = duplex
  }

  // test() {
  //   this.duplex.send('popup', 'test', { a: 1 }, false)
  // }
  sendAppState(state: number) {
    this.duplex.send('popup', POPUP_GET_APP_STATE, state, false)
  }

  updateAccountBalance(params: AccountBalanceParams) {
    this.duplex.send('popup', UPDATE_ACCOUNT_BALANCE, params, false)
  }

  updateAccountLockBalance(params: AccountLockBalanceParams) {
    this.duplex.send('popup', UPDATE_ACCOUNT_LOCK_BALANCE, params, false)
  }

  updateTxStatus(params: TxStatusParams) {
    this.duplex.send('popup', UPDATE_TX_STATUS, params, false)
  }

  /**
   * send to pagehook
   */
  approveSuccess(data: AppproveSuccessRes) {
    this.duplex.send('tab', 'tunnel', { action: APPROVE_SUCCESS, data }, false)
  }

  changeActiveAccount(address: string) {
    this.duplex.send('tab', 'tunnel', { action: CHANGE_ACTIVE_ACCOUNT, data: address }, false)
  }

  sendTxSuccess(data: SendSuccessParams) {
    this.duplex.send('tab', 'tunnel', { action: SEND_SUCCESS, data }, false)
  }
}

export default BackgroundAPI
