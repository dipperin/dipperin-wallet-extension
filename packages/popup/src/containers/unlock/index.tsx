import React from 'react'
import { observable, action, runInAction } from 'mobx'
import { observer, inject } from 'mobx-react'

import { APP_STATE } from '@dipperin/lib/constants'
import History from '@/stores/history'
import Wallet from '@/stores/wallet'
import Layout from '@/stores/layout'
import Label from '@/stores/label'
import Button from '@/components/button'
import Tooltip from '@/components/tooltip'
// import Modal from '@/components/modal'

import './unlockStyle.css'

const { ACCOUNT_PAGE, IMPORT_WALLET_PAGE } = APP_STATE

interface ResetModalProp {
  label: Label
  onClose: () => void
  onConfirm: () => void
}

const ResetModal = (props: ResetModalProp) => (
  <div className="unlock-modal">
    <span className="unlock-close-icon" onClick={props.onClose} />
    <div className="unlock-icon-box" />
    <div className="unlock-modal-title">{props.label.label!.extension.wallet.forgetPasswordTitle}</div>
    <p className="unlock-modal-paragh">
      <span dangerouslySetInnerHTML={{ __html: props.label.label!.extension.wallet.forgetPasswordWord }} />
    </p>
    <div className="unlock-modal-btnbox">
      <button className="unlock-modal-cancel" onClick={props.onClose}>
        Cancel
      </button>
      <button className="unlock-modal-confirm" onClick={props.onConfirm}>
        Confirm
      </button>
    </div>
  </div>
)

interface UnlockProps {
  history?: History
  wallet?: Wallet
  layout?: Layout
  label?: Label
}
@inject('history', 'wallet', 'layout', 'label')
@observer
class Unlock extends React.Component<UnlockProps> {
  @observable
  password = ''

  @observable
  tooltipMsg = ''

  @observable
  displayTooltip = false

  @observable
  forgetPasswordCount = 0

  @observable
  modalHandler = {
    show: false,
    msg: ''
  }

  @action
  forgetPassword = () => {
    this.modalHandler.show = true
  }

  debounce = (fn: () => void, duration: number) => {
    let timestamp = 0
    return () => {
      if (Date.now() - timestamp > duration) {
        timestamp = Date.now()
        fn()
      }
    }
  }

  confirmForgetPassword = () => {
    runInAction(() => {
      this.modalHandler.show = false
    })
    this.props.wallet!.resetWallet()
    this.props.history!.historyPush(IMPORT_WALLET_PAGE)
  }

  handleForgetPassword = this.debounce(this.forgetPassword, 4000)

  @action
  handlePassword = e => {
    this.password = e.target.value
  }

  toAcccount = () => {
    this.props.history!.historyPush(ACCOUNT_PAGE)
  }

  submitPassword = async () => {
    this.props.layout!.handleOpenLoading()
    try {
      await this.props.wallet!.unlockWallet(this.password)
      this.props.layout!.handleCloseLoading(this.toAcccount)
    } catch (err) {
      this.props.layout!.handleCloseLoading(this.showTip, err)
    }
  }

  handleKeyDown = e => {
    if (e.keyCode === 13 && this.password) {
      this.submitPassword()
    }
  }

  showTip = (msg: string) => {
    this.tooltipMsg = msg
    this.displayTooltip = true
    setTimeout(() => {
      this.tooltipMsg = ''
      this.displayTooltip = false
    }, 2000)
  }

  handleCloseModal = () => {
    runInAction(() => {
      this.modalHandler.show = false
    })
  }

  render() {
    const btnConfirm = {
      classes: ['unlock-btn-box']
    }
    return (
      <div className="bg-blue">
        <div className="unlock-header">{this.props.label!.label.extension.wallet.unlockWallet}</div>
        <div className="unlock-form-box">
          <p className="g-input-msg-v1">{this.props.label!.label.extension.wallet.password}</p>
          <Tooltip position="bottom" displayTooltip={this.displayTooltip} message={this.tooltipMsg} size={210}>
            <input
              className="g-input-v1"
              type="password"
              value={this.password}
              onChange={this.handlePassword}
              onKeyDown={this.handleKeyDown}
            />
          </Tooltip>
        </div>
        <Button params={btnConfirm} disabled={!this.password} onClick={this.submitPassword}>
          {this.props.label!.label.extension.wallet.confirm}
        </Button>
        <p className="accounts-txRecordLink" onClick={this.handleForgetPassword}>
          {this.props.label!.label.extension.wallet.forgetPassword}
        </p>
        {this.modalHandler.show && (
          <ResetModal
            onClose={this.handleCloseModal}
            onConfirm={this.confirmForgetPassword}
            label={this.props.label!}
          />
        )}
        {/* <Modal showModal={this.modalHandler.show} size={250}>
          {this.modalHandler.msg}
        </Modal> */}
      </div>
    )
  }
}

export default Unlock
