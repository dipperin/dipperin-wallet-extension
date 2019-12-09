import React from 'react'
import { action, observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import _ from 'lodash'

import Account from '@/stores/account'
import History from '@/stores/history'
import Transaction from '@/stores/transaction'
import Label from '@/stores/label'
import Layout from '@/stores/layout'
import Dapp from '@/stores/dapp'

import NavHeader from '@/components/navHeader'
import Modal from '@/components/modal'

import { APP_STATE } from '@dipperin/lib/constants'
import Button from '@/components/button'
// import { popupLog as log } from '@dipperin/lib/log'

const { ACCOUNT_PAGE, SETTING_PAGE } = APP_STATE

interface SendProps {
  account?: Account
  history?: History
  transaction?: Transaction
  label?: Label
  layout?: Layout
  dapp?: Dapp
}

@inject('account', 'history', 'transaction', 'label', 'layout', 'dapp')
@observer
class SignMessage extends React.Component<SendProps> {
  @observable
  SignMessage: string = ''
  @observable
  modalHandler = {
    modalMsg: '',
    show: false
  }

  componentWillMount() {
    this.getSignMessage()
  }

  componentDidMount() {
    this.adjustWindow()
  }

  adjustWindow = () => {
    const innerHeight = window.innerHeight
    const innerWidth = window.innerWidth
    const targetHeight = 490
    const targetWidth = 360
    window.resizeBy(targetWidth - innerWidth, targetHeight - innerHeight)
  }

  @action
  getSignMessage = async () => {
    this.SignMessage = (await this.props.dapp!.getSignMessage()) as any
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

  turnToAccounnts = () => {
    this.props.history!.historyPush(ACCOUNT_PAGE)
  }

  turnToSettings = () => {
    this.props.history!.historyPush(SETTING_PAGE)
  }

  formatNumber = (num: string, w: number) => {
    const rex = new RegExp(`[0-9]*\.?[0-9]{0,${w}}`)
    const fNum = rex.exec(num) ? rex.exec(num) : '0'
    const nNum = Number(fNum)
    const m = 10 ** w
    const b = Math.floor(nNum * m) / m
    return b.toLocaleString('zh-Hans', {
      maximumFractionDigits: w
    })
  }

  formatAddress = address => {
    const frontPart = address
      .split('')
      .slice(0, 17)
      .join('')
    const backPart = address
      .split('')
      .slice(29, 46)
      .join('')
    return `${frontPart}...${backPart}`
  }

  handleSignMessage = () => {
    this.props.dapp!.confirmSignMessage()
    this.closeWindow()
  }

  closeWindow = () => {
    window.opener = null
    window.open('', '_self')
    window.close()
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
        <div className="send-content-box">
          <div
            className="send-balance-info"
            style={{ margin: '30px 0 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}
          >
            <span className="send-balance-title" style={{ fontSize: '16px' }}>
              {label.currentAddress}:
            </span>
            <span className="send-balance-amount" style={{ fontSize: '12px' }}>
              {this.formatAddress(this.props.account!.activeAccount.address)}
            </span>
          </div>
          <div
            className="send-balance-info"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '15px' }}
          >
            <span className="send-balance-title" style={{ fontSize: '16px' }}>
              {label.accountBalance}:
            </span>
            <span className="send-balance-amount" style={{ fontSize: '12px' }}>{` ${this.formatNumber(
              activeAccount.balance,
              6
            )} DIP`}</span>
          </div>
          <p className="g-input-msg-v1">{label.message}</p>
          <textarea
            className="g-input-v1"
            value={this.SignMessage}
            readOnly={true}
            style={{ height: '150px', padding: '10px 15px' }}
          />
        </div>
        <div className="send-button-box" style={{ padding: '0 20px', marginTop: '30px' }}>
          <Button params={btnCancel} onClick={this.closeWindow}>
            {label.cancel}
          </Button>
          <Button params={btnConfirm} onClick={this.handleSignMessage}>
            {label.sign}
          </Button>
        </div>
        <Modal showModal={this.modalHandler.show} size={250}>
          {this.modalHandler.modalMsg}
        </Modal>
      </div>
    )
  }
}

export default SignMessage
