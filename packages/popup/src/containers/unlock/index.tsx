import React from 'react'
import { observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'

import { APP_STATE } from '@dipperin/lib/constants'
import History from '@/stores/history'
import Wallet from '@/stores/wallet'
import Layout from '@/stores/layout'
import Button from '@/components/button'
import Tooltip from '@/components/tooltip'

import './unlockStyle.css'

const { ACCOUNT_PAGE } = APP_STATE
interface UnlockProps {
  history?: History
  wallet?: Wallet
  layout?: Layout
}

@inject('history', 'wallet', 'layout')
@observer
class Unlock extends React.Component<UnlockProps> {
  @observable
  password = ''

  @observable
  tooltipMsg = ''

  @observable
  displayTooltip = false

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

  render() {
    const btnConfirm = {
      classes: ['unlock-btn-box']
    }
    return (
      <div className="bg-blue">
        <div className="unlock-header">Unlock Wallet</div>
        <div className="unlock-form-box">
          <p className="g-input-msg-v1">Password</p>
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
          Confirm
        </Button>
      </div>
    )
  }
}

export default Unlock
