import React from 'react'
import { observable, runInAction } from 'mobx'
import { inject, observer } from 'mobx-react'
import classnames from 'classnames'

import NavHeader from '@/components/navHeader'
import HrLine from '@/components/hrLine'
import Account from '@/stores/account'
import History from '@/stores/history'
import Wallet from '@/stores/wallet'

import './settingStyle.css'
import { APP_STATE, MAIN_NET, TEST_NET, REMOTE_MECURY, REMOTE_TEST, HAS_TEST_NET } from '@dipperin/lib/constants'
import { popupLog as log } from '@dipperin/lib/log'
import Button from '@/components/button'

const { ACCOUNT_PAGE, SEND_PAGE } = APP_STATE

interface SettingsProps {
  account?: Account
  history?: History
  wallet?: Wallet
}

@inject('account', 'history', 'wallet')
@observer
class Settings extends React.Component<SettingsProps> {
  @observable
  mainActive: boolean = true

  constructor(props) {
    super(props)
    this.props.wallet!.getCurrentNet()!.then(res => {
      this.mainActive = res === REMOTE_MECURY
    })
  }

  turnToAccount = () => {
    this.props.history!.historyPush(ACCOUNT_PAGE)
  }

  turnToSend = () => {
    this.props.history!.historyPush(SEND_PAGE)
  }

  handleChangeNet = (flag: boolean) => e => {
    runInAction(() => {
      this.mainActive = flag
    })
    const net = flag ? REMOTE_MECURY : REMOTE_TEST
    log.debug(`Setting page, change net to ${net}`)
    this.props.wallet!.changeNet(net)
  }

  handleReset = () => {
    this.props.wallet!.resetWallet()
  }

  turnToDappSend = () => {
    this.props.history!.historyPush(APP_STATE.DAPP_SEND_PAGE)
  }

  turnToAuth = () => {
    this.props.history!.historyPush(APP_STATE.DAPP_AUTH)
  }

  render() {
    const resetWallet = {
      classes: ['setting-button-box'],
      color: 'gray',
      size: 'middle'
    }
    return (
      <div className="bg-blue">
        <NavHeader />
        <HrLine />

        <div className="setting-close-box">
          <span className="setting-close-icon" onClick={this.turnToAccount} />
        </div>

        <div className="setting-content">
          <div className="setting-title">Networks</div>
          <div
            className={classnames({
              'setting-netword-item': !this.mainActive,
              'setting-netword-active': this.mainActive
            })}
            onClick={this.handleChangeNet(true)}
          >
            <span className="setting-mainnet-icon" />
            <span className="setting-net">{MAIN_NET}</span>
            {this.mainActive && <span className="setting-activenet" />}
          </div>

          {HAS_TEST_NET && (
            <div
              className={classnames({
                'setting-netword-item': this.mainActive,
                'setting-netword-active': !this.mainActive
              })}
              onClick={this.handleChangeNet(false)}
            >
              <span className="setting-testnet-icon" />
              <span className="setting-net">{TEST_NET}</span>
              {!this.mainActive && <span className="setting-activenet" />}
            </div>
          )}
        </div>

        <Button params={resetWallet} onClick={this.handleReset}>
          Reset DipperinLink
        </Button>
        {/* <Button params={{ classes: [] }} onClick={this.turnToDappSend}>
          To DAPP_SEND
        </Button>
        <Button params={{ classes: [] }} onClick={this.turnToAuth}>
          To Auth
        </Button> */}
      </div>
    )
  }
}

export default Settings
