import React from 'react'
import { action, observable, computed, autorun } from 'mobx'
import { observer, inject } from 'mobx-react'
import _ from 'lodash'

import Account from '@/stores/account'
import History from '@/stores/history'
import Transaction from '@/stores/transaction'
import Label from '@/stores/label'

import NavHeader from '@/components/navHeader'
import Modal from '@/components/modal'
import { verifyNumber } from '@/utils'
import { popupLog as log } from '@dipperin/lib/log'
import './dappSendStyle.css'

import { APP_STATE, ORIGIN_FEE } from '@dipperin/lib/constants'
import { SendTxParams } from '@dipperin/lib/models/transaction'
import Button from '@/components/button'

const { ACCOUNT_PAGE, SETTING_PAGE } = APP_STATE

interface DappSendProps {
  account?: Account
  history?: History
  transaction?: Transaction
  label?: Label
}

@inject('account', 'history', 'transaction', 'label')
@observer
class DappSend extends React.Component<DappSendProps> {
  @observable
  appName: string

  @observable
  extraData: string

  @observable
  sendToAddress: string = ''

  @observable
  sendAmount: string = ''

  @observable
  minFee: string = String(ORIGIN_FEE)

  @observable
  sendPoundage: string = String(ORIGIN_FEE)

  @observable
  modalHandler = {
    modalMsg: '',
    show: false
  }

  @computed
  get verifyPoundage() {
    return Number(this.sendPoundage) >= Number(this.minFee)
  }

  constructor(props) {
    super(props)
    this.getTransactionInfo()
    // this.resizeWindow()
    this.adjustWindow()
    autorun(() => {
      this.getMinFee()
    })
    this.setAutoCloseWindow()
  }

  adjustWindow = () => {
    const innerHeight = window.innerHeight
    const innerWidth = window.innerWidth
    const targetHeight = 490
    const targetWidth = 360
    window.resizeBy(targetWidth - innerWidth, targetHeight - innerHeight)
  }

  setAutoCloseWindow = () => {
    setTimeout(() => {
      this.toQuit()
    }, 200000)
  }
  @action
  getTransactionInfo = async () => {
    const appTx = await this.props.transaction!.getAppTx()
    console.log(appTx)
    this.appName = appTx.appName
    this.sendToAddress = appTx.to
    this.sendAmount = appTx.value
    this.extraData = appTx.extraData
  }

  turnToAccounnts = () => {
    this.props.history!.historyPush(ACCOUNT_PAGE)
  }

  turnToSettings = () => {
    this.props.history!.historyPush(SETTING_PAGE)
  }

  toQuit = () => {
    window.opener = null
    window.open('', '_self')
    window.close()
  }

  @action
  handleAddress = e => {
    this.sendToAddress = e.target.value
  }

  @action
  handleAmount = e => {
    if (!verifyNumber(e.target.value)) {
      return
    }
    this.sendAmount = e.target.value
  }

  @action
  handlePoundage = e => {
    if (!verifyNumber(e.target.value)) {
      return
    }
    console.log('handlePoundage')
    this.sendPoundage = e.target.value
  }

  @action
  setMinFee = fee => {
    if (Number(fee) > ORIGIN_FEE) {
      this.minFee = fee
    }
  }

  @action
  updatePoundage = () => {
    if (!this.verifyPoundage) {
      this.sendPoundage = this.minFee
    }
  }

  genTx = (address: string, amount: string, fee?: string) => {
    const baseTx: SendTxParams = {
      address,
      amount,
      memo: this.extraData
    }
    if (fee) {
      baseTx.fee = fee
    }
    return baseTx
  }

  getMinFee = () => {
    if (this.sendToAddress && this.sendAmount) {
      const tx = this.genTx(this.sendToAddress, this.sendAmount)
      log.debug('getMinFee' + tx)
      this.props
        .transaction!.getMinTransactionFee(tx)!
        .then((res: string) => {
          console.log('Send-getMinFee-res:', res)
          this.setMinFee(res)
          this.updatePoundage()
        })!
        .catch(e => {
          console.log('send-getMinFee-error:', e)
        })
    }
  }

  verifyBalance = () => {
    const accountBalance = this.props.account!.activeAccount.balance
    return Number(accountBalance) >= Number(this.sendPoundage) + Number(this.sendAmount)
  }

  verifyTx = () => {
    // TODO: add info to constant
    if (!this.sendToAddress) {
      return { success: false, info: this.props.label!.label.extension.send.errorAddress }
    } else if (!this.sendAmount) {
      return { success: false, info: this.props.label!.label.extension.send.errorAmount }
    } else if (!this.sendPoundage) {
      return { success: false, info: this.props.label!.label.extension.send.errorPoundage }
    } else if (!this.verifyBalance()) {
      return { success: false, info: this.props.label!.label.extension.send.errorBalance }
    } else {
      return { success: true }
    }
  }

  translateErrorInfo = (error: string): string => {
    const frequent = [
      'ResponseError: Returned error: "this transaction already in tx pool"',
      'ResponseError: Returned error: "new fee is too low to replace old one"'
    ]
    if (frequent.includes(error)) {
      return this.props.label!.label.extension.send.errorFrequent
    }
    return error
  }

  sendTransfer = async () => {
    // TODO: add verify
    const res = this.verifyTx()
    if (res.success) {
      try {
        await this.props.transaction!.sendTxForApp(this.sendPoundage)
        console.log('Send Success!')
        this.showMsg(this.props.label!.label.extension.send.sendSuccess, this.closeWindow)
      } catch (err) {
        console.log('dappSend-sendTransfer-error:', err)
        this.showMsg(this.translateErrorInfo(err as string))
        // this.showMsg("Send Fail!",this.closeWindow)
      }
    } else {
      this.showMsg(res.info as string)
    }
  }

  sendAppTx = async () => {
    const txParam = this.genTx(this.sendToAddress, this.sendAmount, this.sendPoundage)
    const res = await this.props.transaction!.sendAppTx(txParam)
    if (res.success) {
      this.showMsg(res.info, this.closeWindow)
    } else {
      this.showMsg(res.info)
    }
  }

  handleTransfer = _.throttle(this.sendTransfer, 4000)

  closeWindow = () => {
    window.opener = null
    window.open('', '_self')
    window.close()
  }

  @action
  showMsg = (msg: string, cb?: () => void) => {
    this.modalHandler.modalMsg = msg
    this.modalHandler.show = true
    setTimeout(() => {
      this.modalHandler.modalMsg = ''
      this.modalHandler.show = false
      if (cb) {
        cb()
      }
    }, 2000)
  }

  formatExtraData = () => {
    const dataList: string[] = JSON.parse(this.extraData || '[]') as string[]
    return dataList.join('-')
  }

  render() {
    const activeAccount = this.props.account!.activeAccount
    const btnCancel = {
      classes: [],
      color: 'gray',
      float: 'left',
      size: 'small'
    }
    const btnConfirm = {
      classes: [],
      color: 'blue',
      float: 'right',
      size: 'small'
    }
    return (
      <div className="bg-blue">
        <NavHeader />
        <div className="dapp-cover" />
        <div className="send-content-box">
          <div className="send-balance-info">
            <span className="send-balance-title">{this.props.label!.label.extension.send.accountBalance}:</span>
            <span className="send-balance-amount">{`  ${activeAccount.balance} DIP`}</span>
          </div>
          <div className="dappsend-txinfo">
            <div className="dapp-info-name">
              <p className="dapp-info-msg">
                {this.appName} {this.props.label!.label.extension.send.officialAddress}
              </p>
              <input className="g-input-v1" type="text" value={this.sendToAddress} disabled={true} />
            </div>
            <div className="dapp-info-amount">
              <p className="dapp-info-msg">{this.props.label!.label.extension.send.betAmount}</p>
              <input className="g-input-v1" type="text" value={this.sendAmount} disabled={true} />
            </div>
            <div className="dapp-info-betNumber">
              <p className="dapp-info-msg">{this.props.label!.label.extension.send.betNumber}</p>
              <input className="g-input-v1" type="text" value={this.formatExtraData()} disabled={true} />
            </div>
          </div>
          <p className="g-input-msg-v1 send-msg-v2">
            {this.props.label!.label.extension.send.poundage}{' '}
            <span className="send-reminder">
              {this.props.label!.label.extension.send.moreThan} {this.minFee}
            </span>
          </p>
          <input className="g-input-v1" type="number" value={this.sendPoundage} onChange={this.handlePoundage} />
        </div>
        <div className="g-2btn-area dapp-button-box">
          <Button params={btnCancel} onClick={this.toQuit}>
            {this.props.label!.label.extension.wallet.cancel}
          </Button>
          <Button params={btnConfirm} onClick={this.handleTransfer}>
            {this.props.label!.label.extension.wallet.confirm}
          </Button>
        </div>
        <Modal showModal={this.modalHandler.show} size={250}>
          {this.modalHandler.modalMsg}
        </Modal>
      </div>
    )
  }
}

export default DappSend
