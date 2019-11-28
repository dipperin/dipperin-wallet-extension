import React from 'react'
import { observable, action, computed } from 'mobx'
import { observer, inject } from 'mobx-react'
import _ from 'lodash'

import Wallet from '@/stores/wallet'
import History from '@/stores/history'
import Label from '@/stores/label'
import AppHeader from '@/components/header'
import Button from '@/components/button'
import Tooltip from '@/components/tooltip'
import { APP_STATE } from '@dipperin/lib/constants'
import { popupLog as log } from '@dipperin/lib/log'

import './createStyle.css'

const { HAS_NO_WALLET, BACKUP_PAGE } = APP_STATE

interface Props {
  wallet?: Wallet
  history?: History
  label?: Label
}

@inject('wallet', 'history', 'label')
@observer
class SetPassword extends React.Component<Props> {
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

  constructor(props) {
    super(props)
  }

  toQuit = () => {
    this.props.history!.historyPush(HAS_NO_WALLET)
  }

  toBackup = () => {
    this.props.history!.historyPush(BACKUP_PAGE)
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

  @computed
  get verifyInput() {
    const { password, repeatPassword } = this.input
    const flagLen = password.split('').length >= 8
    if (password && password === repeatPassword && flagLen) {
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

  setPassword = async () => {
    try {
      await this.props.wallet!.setPassword(this.input.password)
      log.debug('set password success!')
      this.toBackup()
    } catch (e) {
      log.error('CreateLayout-create-error:' + e)
    }
  }

  handleToBackup = _.throttle(this.setPassword, 1000, { trailing: false })

  handleonKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13 && this.verifyInput) {
      this.handleToBackup()
    }
  }

  @action
  handlePswBlur = () => {
    const cond = this.input.password.split('').length > 7
    if (!cond) {
      this.msgs.psw[0] = this.props.label!.label.wallet.atLeast
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
      size: 'small',
      float: 'left'
    }
    const btnConfirm = {
      classes: [],
      color: 'blue',
      size: 'small',
      float: 'right'
    }
    const wallet = this.props.label!.label.wallet
    return (
      <div className="bg-blue">
        <AppHeader />
        <div className="create-modal">
          <p className="g-input-msg-v1">
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
          <p className="g-input-msg-v1">{this.props.label!.label.wallet.repeatPassword}</p>
          <Tooltip
            position="bottom"
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
          <Button params={btnCancel} onClick={this.toQuit}>
            {this.props.label!.label.wallet.cancel}
          </Button>
          <Button params={btnConfirm} onClick={this.handleToBackup} disabled={!this.verifyInput}>
            {this.props.label!.label.wallet.confirm}
          </Button>
        </div>
      </div>
    )
  }
}

export default SetPassword
