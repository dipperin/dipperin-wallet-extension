import React from 'react'
import { observable, runInAction, action } from 'mobx'
import { inject, observer } from 'mobx-react'

import NavHeader from '@/components/navHeader'
import HrLine from '@/components/hrLine'
import Modal from '@/components/modal'
import Account from '@/stores/account'
import History from '@/stores/history'
import Wallet from '@/stores/wallet'
import Label from '@/stores/label'

import './settingStyle.css'
import { APP_STATE, MAIN_NET, TEST_NET, REMOTE_VENUS, REMOTE_TEST, HAS_TEST_NET } from '@dipperin/lib/constants'
import { popupLog as log } from '@dipperin/lib/log'
import Button from '@/components/button'
import Choice from './choice'

const { ACCOUNT_PAGE, SEND_PAGE } = APP_STATE

interface SettingsProps {
  account?: Account
  history?: History
  wallet?: Wallet
  label?: Label
}

@inject('account', 'history', 'wallet', 'label')
@observer
class Settings extends React.Component<SettingsProps> {
  @observable
  mainActive: boolean = true
  @observable
  showResetModal: boolean = false

  // @observable
  // lang: string = 'en'

  constructor(props) {
    super(props)
    this.props.wallet!.getCurrentNet()!.then(res => {
      this.mainActive = res === REMOTE_VENUS
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
    const net = flag ? REMOTE_VENUS : REMOTE_TEST
    log.debug(`Setting page, change net to ${net}`)
    this.props.wallet!.changeNet(net)
  }

  @action
  handleShowResetModal = () => {
    this.showResetModal = true
  }

  @action
  handleCloseResetModal = () => {
    this.showResetModal = false
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

  changeLang = (newlang: string) => () => {
    this.props.label!.updateLang(newlang)
  }

  render() {
    const resetWallet = {
      classes: ['setting-button-box'],
      color: 'gray',
      size: 'middle'
    }
    const lang = this.props.label!.lang
    return (
      <div className="bg-blue">
        <NavHeader />
        <HrLine />
        <div className="setting-box">
          <span className="setting-close-icon" onClick={this.turnToAccount} />

          <div className="setting-content">
            <div className="setting-title">{this.props.label!.label.setting.network}</div>
            <Choice active={this.mainActive} onClick={this.handleChangeNet(true)}>
              <span className="setting-mainnet-icon" />
              <span className="setting-net">{this.props.label!.label.setting[MAIN_NET]}</span>
            </Choice>
            {HAS_TEST_NET && (
              <Choice active={!this.mainActive} onClick={this.handleChangeNet(false)}>
                <span className="setting-testnet-icon" />
                <span className="setting-net">{this.props.label!.label.setting[TEST_NET]}</span>
              </Choice>
            )}
          </div>

          <div className="setting-content">
            <div className="setting-title">{this.props.label!.label.setting.languages}</div>
            <Choice active={lang === 'en-US'} onClick={this.changeLang('en-US')}>
              <span className="setting-net">{this.props.label!.label.setting.enUS}</span>
            </Choice>
            <Choice active={lang === 'zh-CN'} onClick={this.changeLang('zh-CN')}>
              <span className="setting-net">{this.props.label!.label.setting.zhCN}</span>
            </Choice>
          </div>

          <Button params={resetWallet} onClick={this.handleShowResetModal}>
            {this.props.label!.label.setting.reset}
          </Button>
          {/* <Button params={{ classes: [] }} onClick={this.turnToDappSend}>
          To DAPP_SEND
        </Button>
        <Button params={{ classes: [] }} onClick={this.turnToAuth}>
          To Auth
        </Button> */}
          <Modal
            showModal={this.showResetModal}
            theme={'white'}
            style={{
              position: 'absolute',
              borderRadius: '10px',
              top: '175px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '20px',
              lineHeight: 1.5,
              textAlign: 'center',
              fontWeight: 400,
              background: '#fff',
              width: '266px',
              height: '190px',
              boxSizing: 'border-box',
              padding: 0
            }}
          >
            <span
              className="unlock-close-icon"
              style={{ cursor: 'pointer', zIndex: 9 }}
              onClick={this.handleCloseResetModal}
            />
            <div className="unlock-modal-title" style={{ top: '21px' }}>
              {this.props.label!.label.setting.confirmReset}
            </div>
            <p className="unlock-modal-paragh" style={{ top: '50px' }}>
              <span style={{ fontSize: '12px' }}>{this.props.label!.label.setting.warnText}</span>
            </p>
            <div className="unlock-modal-btnbox" style={{ top: '140px' }}>
              <button className="unlock-modal-cancel" onClick={this.handleCloseResetModal}>
                {this.props.label!.label.setting.close}
              </button>
              <button className="unlock-modal-confirm" onClick={this.handleReset}>
                {this.props.label!.label.setting.confirm}
              </button>
            </div>
            {/* <div style={{ width: '100%', height: '100%', background: '#fff' }}>111</div> */}
          </Modal>
        </div>
      </div>
    )
  }
}

export default Settings
