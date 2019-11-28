import React from 'react'
import { observable, action, computed } from 'mobx'
import { observer, inject } from 'mobx-react'
import _ from 'lodash'

import Wallet from '@/stores/wallet'
import History from '@/stores/history'
import Layout from '@/stores/layout'
import Label from '@/stores/label'
import Button from '@/components/button'
import Tooltip from '@/components/tooltip'
import Modal from '@/components/modal'

import AppHeader from '@/components/header'
import './importStyle.css'

import { APP_STATE } from '@dipperin/lib/constants'

const { HAS_NO_WALLET, ACCOUNT_PAGE } = APP_STATE

interface Props {
  wallet?: Wallet
  history?: History
  layout?: Layout
  label?: Label
}

@inject('wallet', 'history', 'layout', 'label')
@observer
class Import extends React.Component<Props> {
  @observable
  mnemonic = ''

  @observable
  input = {
    password: '',
    repeatPassword: ''
  }

  @observable
  msgs = {
    psw: ['', false],
    rpsw: ['', false]
  }

  @observable
  modalHandler = {
    modalMsg: '',
    show: false
  }

  @action
  handlePassword = (e: React.ChangeEvent<{ value: string }>) => {
    if (/^[a-zA-Z0-9`~!@#$%^&*()_+<>?:"{},.\\/;'[\]]{0,24}$/.test(e.target.value)) {
      this.input.password = e.target.value
    }
  }

  @action
  handleRepeatPassword = (e: React.ChangeEvent<{ value: string }>) => {
    this.input.repeatPassword = e.target.value
  }

  @action
  showModal = (message: string) => {
    this.modalHandler.modalMsg = message
    this.modalHandler.show = true
  }

  @action
  closeModal = () => {
    this.modalHandler.show = false
    this.modalHandler.modalMsg = ''
  }

  @computed
  get verifyInput() {
    const { password, repeatPassword } = this.input
    const flagLen = this.input.password.split('').length >= 8
    if (this.mnemonic && (password && password === repeatPassword && flagLen)) {
      return true
    }
    return false
  }

  @computed
  get passwordStrength() {
    let result = 0
    if (/[a-z]/.test(this.input.password)) {
      result += 1
    }
    if (/[A-Z]/.test(this.input.password)) {
      result += 1
    }
    if (/[0-9]/.test(this.input.password)) {
      result += 1
    }
    if (/[`~!@#$%^&*()_+<>?:"{},.\\/;'[\]]/.test(this.input.password)) {
      result += 1
    }
    return result
  }

  @action
  handleMnemonic = (e: React.ChangeEvent<{ value: string }>) => {
    this.mnemonic = e.target.value
  }

  handleCancel = () => {
    this.props.history!.historyPush(HAS_NO_WALLET)
  }
  toAccount = () => {
    this.props.history!.historyPush(ACCOUNT_PAGE)
  }

  importWallet = async () => {
    this.props.layout!.handleOpenLoading()
    try {
      const res = await this.props.wallet!.importWallet(this.input.password, this.mnemonic)
      console.log('import-handleContinue-res:', res)
      this.props.layout!.handleCloseLoading(this.toAccount)
    } catch (e) {
      console.log('import-handleContinue-error:', e.message)
      this.props.layout!.handleCloseLoading()
      let errorText: string = ''
      switch (e.message) {
        case `invalid mnemonic`:
          errorText = this.props.label!.label.wallet.invalidMnemonic
      }
      this.showModal(errorText)
      setTimeout(() => {
        this.closeModal()
      }, 2000)
    }
  }

  handleConfirm = _.throttle(this.importWallet, 4000, { trailing: false })

  handleonKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13 && this.verifyInput) {
      this.handleConfirm()
    }
  }

  @action
  handlePswBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (this.input.password.split('').length === 0) {
      this.msgs.psw[0] = this.props.label!.label.wallet.emptyPassword
      this.msgs.psw[1] = true
    } else if (!(this.input.password.split('').length > 7)) {
      this.msgs.psw[0] = this.props.label!.label.wallet.shortPassword
      this.msgs.psw[1] = true
    }
    setTimeout(() => {
      this.msgs.psw[1] = false
    }, 2000)
  }

  @action
  handleRpswBlur = () => {
    const cond = this.input.password !== this.input.repeatPassword
    if (cond) {
      this.msgs.rpsw[0] = this.props.label!.label.wallet.notSamePassword
      this.msgs.rpsw[1] = true
    }
    setTimeout(() => {
      this.msgs.rpsw[1] = false
    }, 2000)
  }

  render() {
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
    const pStyles = {
      display: 'block',
      margin: 0,
      width: '100%',
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: '18px',
      color: 'rgba(200, 200, 200, 1)'
    }

    const wallet = this.props.label!.label.wallet
    return (
      <div className="bg-blue">
        <AppHeader />

        <div className="import-modal">
          <p style={pStyles}>{this.props.label!.label.wallet.inputMnemonic}</p>
          <textarea className="g-text-mnemonic import-mnemonic" value={this.mnemonic} onChange={this.handleMnemonic} />
          <p className="g-input-msg-v1 import-msg">
            {this.props.label!.label.wallet.setPassword}
            <span className="g-tip">{this.props.label!.label.wallet.atLeast}</span>
          </p>
          <Tooltip
            position="top"
            message={this.msgs.psw[0] as string}
            displayTooltip={this.msgs.psw[1] as boolean}
            size={310}
          >
            <input
              className="g-input-v1"
              type="password"
              value={this.input.password}
              onChange={this.handlePassword}
              onBlur={this.handlePswBlur}
            />
          </Tooltip>
          <div className="create-password-strength">
            <span className="create-password-label">{wallet.passwordStrength}</span>
            <span className={`create-password-default ${this.passwordStrength > 0 ? 'create-password-weak' : ''}`}>
              {this.passwordStrength === 1 && wallet.weak}
            </span>
            <span className={`create-password-default ${this.passwordStrength > 1 ? 'create-password-medium' : ''}`}>
              {this.passwordStrength > 1 && this.passwordStrength < 4 && wallet.medium}
            </span>
            <span className={`create-password-default ${this.passwordStrength > 3 ? 'create-password-medium' : ''}`}>
              {this.passwordStrength === 4 && wallet.strong}
            </span>
          </div>
          <p className="g-input-msg-v1 import-msg">{this.props.label!.label.wallet.repeatPassword}</p>
          <Tooltip
            position="top"
            message={this.msgs.rpsw[0] as string}
            displayTooltip={this.msgs.rpsw[1] as boolean}
            size={310}
          >
            <input
              className="g-input-v1"
              type="password"
              value={this.input.repeatPassword}
              onChange={this.handleRepeatPassword}
              onKeyDown={this.handleonKeyDown}
              onBlur={this.handleRpswBlur}
            />
          </Tooltip>
        </div>

        <div className="g-2btn-area">
          <Button params={btnCancel} onClick={this.handleCancel}>
            {this.props.label!.label.wallet.cancel}
          </Button>
          <Button params={btnConfirm} disabled={!this.verifyInput} onClick={this.handleConfirm}>
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

export default Import
