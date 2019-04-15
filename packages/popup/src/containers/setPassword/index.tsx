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
  handlePassword = e => {
    this.input.password = e.target.value
  }

  @action
  handleRepeatPassword = e => {
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

  handleonKeyDown = e => {
    if (e.keyCode === 13 && this.verifyInput) {
      this.handleToBackup()
    }
  }

  @action
  handlePswBlur = () => {
    const cond = this.input.password.split('').length > 7
    if (!cond) {
      this.msgs.psw[0] = 'Your password is too short!'
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
      this.msgs.rpsw[0] = 'The first password is not equal to the second password!'
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
    return (
      <div className="bg-blue">
        <AppHeader />
        <div className="create-modal">
          <p className="g-input-msg-v1">
            {this.props.label!.label.extension.wallet.setPassword}
            <span className="g-tip">{this.props.label!.label.extension.wallet.atLeast}</span>
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
          <p className="g-input-msg-v1">{this.props.label!.label.extension.wallet.repeatPassword}</p>
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
            {this.props.label!.label.extension.wallet.cancel}
          </Button>
          <Button params={btnConfirm} onClick={this.handleToBackup} disabled={!this.verifyInput}>
            {this.props.label!.label.extension.wallet.confirm}
          </Button>
        </div>
      </div>
    )
  }
}

export default SetPassword
