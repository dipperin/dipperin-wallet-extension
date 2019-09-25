import React, { Fragment } from 'react'
import { observable, reaction, computed, action } from 'mobx'
import { inject, observer } from 'mobx-react'
import { Utils } from '@dipperin/dipperin.js'

import NavHeader from '@/components/navHeader'
import HrLine from '@/components/hrLine'
import Account from '@/stores/account'
import History from '@/stores/history'
import Wallet from '@/stores/wallet'
import Label from '@/stores/label'
import Transaction from '@/stores/transaction'

import './style.css'
import { APP_STATE } from '@dipperin/lib/constants'
import Pagination from './Pagination'
import TxDetail from './txDetail'

const { ACCOUNT_PAGE } = APP_STATE
const itemPerPage = 6

interface TransactionObj {
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

interface SettingsProps {
  account?: Account
  history?: History
  wallet?: Wallet
  label?: Label
  transaction?: Transaction
}

@inject('account', 'history', 'wallet', 'label', 'transaction')
@observer
class TxRecord extends React.Component<SettingsProps> {
  @observable
  mainActive: boolean = true
  @observable
  transactions: TransactionObj[] = []
  @observable
  currentPage: number = 0
  @observable
  showDetail: boolean = false
  @observable
  transaction: TransactionObj | undefined = undefined

  @computed
  get maxPage() {
    console.log('num of transaction', this.transactions.length)
    return Math.ceil(this.transactions.length / itemPerPage)
  }

  @action
  handlePageChange = (page: number) => {
    if (page >= 0 && page < this.maxPage) {
      this.currentPage = page
    }
  }

  @computed
  get pageTitle() {
    return this.showDetail ? this.props.label!.label.wallet.transactionDetail : ''
  }

  @action
  setTransactions = (txs: TransactionObj[]) => {
    this.transactions = txs
  }

  constructor(props) {
    super(props)

    reaction(
      () => this.props.account!.activeAccount.address,
      address => {
        this.props.transaction!.getTransactions(address)!.then((res: TransactionObj[]) => {
          // console.log(res)
          this.setTransactions(res)
          // this.transactions = res
        })
      }
    )
    const currentAddress = this.props.account!.activeAccount.address
    this.props.transaction!.getTransactions(currentAddress)!.then((res: TransactionObj[]) => {
      // this.transactions = res
      this.setTransactions(res)
    })
  }

  turnToAccount = () => {
    this.props.history!.historyPush(ACCOUNT_PAGE)
  }

  /**
   * @example 1566208829481 -> 19/08/19 18:00:29
   */
  formatTime = (timestamp?: number) => {
    let ret: string = ''
    if (timestamp) {
      const t = new Date(timestamp)
      ret = `${String(t.getFullYear()).slice(2)}/${String(t.getMonth() + 1).padStart(
        2,
        '0'
      )}/${t.getDate()} ${t.getHours()}:${String(t.getMinutes()).padStart(2, '0')}`
    }
    return ret
  }

  /**
   * @example '0x00008AD27452ACD62e646088A76D098156B2358357ff' -> '0x0...57ff'
   */
  formatAddress = (address?: string) => {
    let ret: string = ''
    if (address) {
      ret = `${address.slice(0, 3)}...${address.slice(42)}`
    }
    return ret
  }

  formatBalance = (amount?: string) => {
    let ret: string = ''
    if (amount) {
      ret = `${Number(Utils.fromUnit(amount)).toLocaleString()} DIP`
    }
    return ret
  }

  handleCloseDetail = () => {
    this.showDetail = false
  }

  handleTurnDetail(tx: TransactionObj) {
    this.showDetail = true
    this.transaction = tx
  }

  render() {
    // const lang = this.props.label!.lang
    return (
      <div className="bg-blue">
        <NavHeader title={this.pageTitle} />
        <HrLine />
        {!this.showDetail && (
          <Fragment>
            <div className="setting-box">
              <span className="setting-close-icon" onClick={this.turnToAccount} />
              <div className="txRecord_table_head">
                <span style={{ minWidth: '30%' }} className="txRecord_thead_item">
                  Time
                </span>
                <span style={{ minWidth: '25%' }} className="txRecord_thead_item">
                  From
                </span>
                <span style={{ minWidth: '25%' }} className="txRecord_thead_item">
                  To
                </span>
                <span className="txRecord_thead_item">Account</span>
              </div>
              <div>
                {this.transactions.slice(this.currentPage * 6, this.currentPage * 6 + itemPerPage).map((tx, index) => (
                  <div onClick={this.handleTurnDetail.bind(this, tx)} key={index} className="txRecord_tbody_row">
                    <span style={{ minWidth: '25%' }}>{this.formatTime(tx.timestamp)}</span>
                    <span title={tx.from}>{this.formatAddress(tx.from)}</span>
                    <span title={tx.to}>{this.formatAddress(tx.to)}</span>
                    <span>{this.formatBalance(tx.value)}</span>
                  </div>
                ))}
              </div>
            </div>
            <Pagination maxPage={this.maxPage} currentPage={this.currentPage} handlePage={this.handlePageChange} />
          </Fragment>
        )}
        {this.showDetail && <TxDetail transaction={this.transaction!} onClose={this.handleCloseDetail} />}
      </div>
    )
  }
}

export default TxRecord
