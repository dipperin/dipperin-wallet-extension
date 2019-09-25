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
import './dappSendStyle.css'

import { APP_STATE } from '@dipperin/lib/constants'
import { SendTxParams } from '@dipperin/lib/models/transaction'
import Button from '@/components/button'

import { popupLog as log } from '@dipperin/lib/log'
import { Utils } from '@dipperin/dipperin.js'

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
  gas: string = '21000'

  @observable
  gasPrice: string = '1'

  @observable
  modalHandler = {
    modalMsg: '',
    show: false
  }

  @computed
  get fee() {
    return Number(this.gasPrice) * Number(this.gas)
  }

  @computed
  get verifyGasPrince() {
    return Number(this.gasPrice) >= 1
  }

  constructor(props) {
    super(props)
    this.getTransactionInfo()
    // this.resizeWindow()
    this.adjustWindow()
    autorun(() => {
      this.getEstimateGas()
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
    log.debug('get Dapp info', appTx)
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
  handleGasPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (/^([1-9][0-9]*)?$/.test(e.target.value)) {
      this.gasPrice = e.target.value
    }
  }

  @action
  updateGasPrice = () => {
    if (!this.verifyGasPrince) {
      this.gasPrice = '1'
    }
  }

  @action
  setGas = (newGas: string) => {
    const re = /^[0-9.]+$/
    if (re.test(newGas)) {
      this.gas = newGas
    }
  }

  genTx = (address: string, amount: string, gasPrice?: string) => {
    const baseTx: SendTxParams = {
      address,
      amount,
      memo: this.extraData
    }
    if (gasPrice) {
      return {
        gasPrice,
        gas: this.gas,
        ...baseTx
      }
    } else {
      return baseTx
    }
  }

  getEstimateGas = async () => {
    if (this.sendToAddress && this.sendAmount) {
      try {
        const tx = this.genTx(this.sendToAddress, this.sendAmount)
        const res = await this.props.transaction!.getEstimateGas(tx)
        log.debug('Send-getEstimateGas-res:', res)
        this.setGas(res as string)
      } catch (e) {
        log.error('send-getEstimateGas-error:' + e)
      }
    }
  }

  translateErrorInfo = (error: string): string => {
    const send = this.props.label!.label.send
    const frequent = [
      'ResponseError: Returned error: "this transaction already in tx pool"',
      'ResponseError: Returned error: "tx nonce is invalid"'
    ]
    if (frequent.includes(error)) {
      return send.errorFrequent
    }
    if (error === 'ResponseError: Returned error: "new fee is too low to replace old one"') {
      return send.lowFee
    }
    return send.errorFrequent
  }

  sendTransfer = async () => {
    const tx = this.genTx(this.sendToAddress, this.sendAmount, this.gasPrice)
    const res = this.props.transaction!.verifyTx(tx)
    if (res.success) {
      log.debug('sendTransfer', 'verifyTx success')
      try {
        await this.props.transaction!.sendTxForApp(tx)
        this.showMsg(this.props.label!.label.send.sendSuccess, this.closeWindow)
      } catch (e) {
        log.error('send-handleTransfer:', e)
        this.showMsg(this.translateErrorInfo(e as string))
      }
    } else {
      this.showMsg(res.info as string)
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
    try {
      const dataList: string[] = JSON.parse(this.extraData || '[]') as string[]
      return dataList.join('-')
    } catch (e) {
      return this.extraData
    }
  }

  @action
  handleAddGasPrice = () => {
    this.gasPrice = String(Number(this.gasPrice) + 1)
    log.debug('gasPrice', this.gasPrice)
  }

  @action
  handleSubGasPrice = () => {
    if (Number(this.gasPrice) > 1) {
      this.gasPrice = String(Number(this.gasPrice) - 1)
    }
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
    const label = this.props.label!.label.send

    return (
      <div className="bg-blue">
        <NavHeader />
        <div className="dapp-cover" />
        <div className="send-content-box">
          <div className="send-balance-info">
            <span className="send-balance-title">{label.accountBalance}:</span>
            <span className="send-balance-amount">{`  ${activeAccount.balance} DIP`}</span>
          </div>
          <div className="dappsend-txinfo">
            <div className="dapp-info-name">
              <p className="dapp-info-msg">
                {this.appName} {label.officialAddress}
              </p>
              <input className="g-input-v1" type="text" value={this.sendToAddress} disabled={true} />
            </div>
            <div className="dapp-info-amount">
              <p className="dapp-info-msg">{label.betAmount}</p>
              <input className="g-input-v1" type="text" value={this.sendAmount} disabled={true} />
            </div>
            <div className="dapp-info-betNumber">
              <p className="dapp-info-msg">{label.betNumber}</p>
              <input className="g-input-v1" type="text" value={this.formatExtraData()} disabled={true} />
            </div>
          </div>
          <p className="g-input-msg-v1 send-msg-v2">{label.poundage} </p>
          <div className="send-poundage-box">
            <input
              className="g-input-v1 send-poundage-input"
              type="text"
              value={`${Utils.fromUnit(String(this.fee))} DIP`}
              // onChange={this.handleGasPrice}
              // onBlur={this.handleBlurGasPrice}
              disabled={true}
            />
            <div className="send-poundage-changer">
              <span className={`send-poundage-add`} onClick={this.handleAddGasPrice} />
              <span
                className={`send-poundage-sub ${this.gasPrice === '1' ? 'send-poundage-disabled' : ''}`}
                onClick={this.handleSubGasPrice}
              />
            </div>
          </div>
          {/* <p className="g-input-msg-v1 send-msg-v2">
            {label.gasPrice}{' '}
            <span className="send-reminder">
              {label.currentPoundageIs} {Utils.fromUnit(String(this.fee))}
            </span>
          </p> */}
          {/* <input
            className="g-input-v1"
            type="number"
            value={this.gasPrice}
            onChange={this.handleGasPrice}
            onBlur={this.updateGasPrice}
          /> */}
        </div>
        <div className="g-2btn-area dapp-button-box">
          <Button params={btnCancel} onClick={this.toQuit}>
            {this.props.label!.label.wallet.cancel}
          </Button>
          <Button params={btnConfirm} onClick={this.handleTransfer}>
            {this.props.label!.label.wallet.confirm}
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
