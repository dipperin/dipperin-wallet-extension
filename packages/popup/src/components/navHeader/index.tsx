import React from 'react'
import { observable, action } from 'mobx'
import { inject, observer } from 'mobx-react'

import { APP_STATE } from '@dipperin/lib/constants'
import History from '@/stores/history'
import Account from '@/stores/account'
import Label from '@/stores/label'
import { genAvatar } from '@/utils'

import { PAGE_NANE_DIC } from './constant'
import './navHeaderStyle.css'

interface NavHeaderProps {
  title?: string
  history?: History
  account?: Account
  label?: Label
}

@inject('history', 'account', 'label')
@observer
class NavHeader extends React.Component<NavHeaderProps> {
  @observable
  showModal: boolean

  constructor(props) {
    super(props)
    this.props.account!.updateAccountStore()
  }
  //
  componentDidMount() {
    document.addEventListener('click', () => {
      this.handleHideModal()
    })
  }

  turnToAccounts = () => {
    this.props.history!.historyPush(APP_STATE.ACCOUNT_PAGE)
  }

  turnToCreateAccount = () => {
    this.props.history!.historyPush(APP_STATE.CREATE_ACCOUNT_PAGE)
  }

  turnToSetting = () => {
    this.props.history!.historyPush(APP_STATE.SETTING_PAGE)
  }

  @action
  handleShowModal = e => {
    // e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    this.showModal = !this.showModal
  }

  @action
  handleHideModal = () => {
    this.showModal = false
  }

  stopPropagation = e => {
    // e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }

  changeActiveAccount = (id: string) => e => {
    this.props.account!.changeCurrentAccount(id)
  }

  render() {
    const appState = this.props.history!.appState
    const accountList = this.props.account!.accountList
    const activeAccount = this.props.account!.activeAccount
    return (
      <div className="nav-main">
        <span className="nav-home-logo" onClick={this.turnToAccounts} />
        <span className="nav-page-name">
          {this.props.title ? this.props.title : PAGE_NANE_DIC[this.props.label!.lang][appState]}
        </span>
        <div className="nav-avatar" onClick={this.handleShowModal}>
          <img className="nav-avatar" alt="" src={genAvatar(activeAccount.address, 30)} />
        </div>
        {this.showModal && (
          <div className="nav-modal" onClick={this.stopPropagation}>
            <div className="nav-addAccount-box">
              <span className="nav-myAccount">{this.props.label!.label.extension.account.myAccounts}</span>
              <span className="nav-addAccount" onClick={this.turnToCreateAccount} />
            </div>
            <div className="nav-accountList-box">
              {accountList.map(obj => {
                return (
                  <div className="nav-account-item" key={obj.id} onClick={this.changeActiveAccount(obj.id)}>
                    <img className="nav-account-avatar" alt="" src={genAvatar(obj.address, 26)} />

                    <div className="nav-account-info">
                      <span className="nav-account-name">{obj.name}</span>
                      <br />
                      <span className="nav-account-balance">{`${obj.balance}  DIP`}</span>
                    </div>
                    {obj.id === activeAccount.id && <span className="nav-account-activemark" />}
                  </div>
                )
              })}
            </div>
            <div className="nav-setting-box" onClick={this.turnToSetting}>
              <span className="nav-setting-icon" />
              <span className="nav-setting-word">{this.props.label!.label.extension.setting.setting}</span>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default NavHeader
