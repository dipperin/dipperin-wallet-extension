import React from 'react'
import { action, observable, computed } from 'mobx'
import { observer, inject } from 'mobx-react'
import _ from 'lodash'

import Account from '@/stores/account'
import History from '@/stores/history'
import Transaction from '@/stores/transaction'
import Label from '@/stores/label'

import NavHeader from '@/components/navHeader'
import Modal from '@/components/modal'

import { verifyNumber } from '@/utils'

import './sendStyle.css'

import { APP_STATE } from '@dipperin/lib/constants'
import Button from '@/components/button'
import { popupLog as log } from '@dipperin/lib/log'
import { Utils } from '@dipperin/dipperin.js'

const { ACCOUNT_PAGE, SETTING_PAGE } = APP_STATE

interface SendProps {
  account?: Account
  history?: History
  transaction?: Transaction
  label?: Label
}

@inject('account', 'history', 'transaction', 'label')
@observer
class Send extends React.Component<SendProps> {
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

  @action
  updateGasPrice = () => {
    if (!this.verifyGasPrince) {
      this.gasPrice = '1'
    }
  }

  @action
  setGas = (newGas: string | undefined) => {
    if (newGas) {
      this.gas = newGas
    }
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

  getEstimateGas = async () => {
    if (this.sendToAddress && this.sendAmount) {
      const tx = this.genTx(this.sendToAddress, this.sendAmount)
      try {
        const res = await this.props.transaction!.getEstimateGas(tx)
        log.debug('Send-getEstimateGas-res:', res)
        this.setGas(res as string)
      } catch (e) {
        log.error('send-getEstimateGas-error:' + e)
      }
    }
  }

  turnToAccounnts = () => {
    this.props.history!.historyPush(ACCOUNT_PAGE)
  }

  turnToSettings = () => {
    this.props.history!.historyPush(SETTING_PAGE)
  }

  @action
  handleAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (/^0?(0x)?(0x[0-9a-fA-F]{0,44})?$/.test(e.target.value)) {
      this.sendToAddress = e.target.value
    }
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
  handleBlurGasPrice = () => {
    if (this.gasPrice === '') {
      this.gasPrice = '1'
    }
  }

  genTx = (address: string, amount: string, gasPrice?: string) => {
    const baseTx = {
      address,
      amount,
      memo: ''
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
        await this.props.transaction!.sendTransaction(tx)
        this.showMsg(this.props.label!.label.send.sendSuccess, this.turnToAccounnts)
      } catch (e) {
        log.error('send-handleTransfer:', e)
        this.showMsg(this.translateErrorInfo(e as string))
      }
    } else {
      this.showMsg(res.info as string)
    }
  }

  handleTransfer = _.throttle(this.sendTransfer, 2000)

  render() {
    const activeAccount = this.props.account!.activeAccount
    const btnSend = {
      classes: []
    }
    const label = this.props.label!.label.send
    return (
      <div className="bg-blue">
        <NavHeader />
        <div className="send-content-box">
          <span className="send-close-icon" onClick={this.turnToAccounnts} />
          <div className="send-balance-info">
            <span className="send-balance-title">{label.accountBalance}:</span>
            <span className="send-balance-amount">{` ${activeAccount.balance} DIP`}</span>
          </div>
          <p className="g-input-msg-v1">{label.receinerAddress}</p>
          <input
            className="g-input-v1"
            type="text"
            value={this.sendToAddress}
            onChange={this.handleAddress}
            onBlur={this.getEstimateGas}
          />
          <p className="g-input-msg-v1 send-msg-v1">{label.amount}</p>
          <input
            className="g-input-v1"
            type="number"
            value={this.sendAmount}
            onChange={this.handleAmount}
            onBlur={this.getEstimateGas}
          />
          <p className="g-input-msg-v1 send-msg-v2">
            {label.gasPrice}{' '}
            <span className="send-reminder">
              {label.currentPoundageIs} {Utils.fromUnit(String(this.fee))}
            </span>
          </p>
          <input
            className="g-input-v1"
            type="number"
            value={this.gasPrice}
            onChange={this.handleGasPrice}
            onBlur={this.handleBlurGasPrice}
          />
        </div>
        <div className="send-button-box">
          <Button params={btnSend} onClick={this.handleTransfer}>
            {label.send} DIP
          </Button>
        </div>
        <Modal showModal={this.modalHandler.show} size={250}>
          {this.modalHandler.modalMsg}
        </Modal>
      </div>
    )
  }
}

export default Send
