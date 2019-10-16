import React, { Fragment } from 'react'
import { observable, action } from 'mobx'
import { inject, observer } from 'mobx-react'

import { APP_STATE } from '@dipperin/lib/constants'
import History from '@/stores/history'
import Account from '@/stores/account'
import Label from '@/stores/label'
import Layout from '@/stores/layout'
import { genAvatar } from '@/utils'

import ImportAccount from './importAccount'

import { PAGE_NANE_DIC } from './constant'
import './navHeaderStyle.css'

interface NavHeaderProps {
  title?: string
  history?: History
  account?: Account
  label?: Label
  layout?: Layout
}

@inject('history', 'account', 'label', 'layout')
@observer
class NavHeader extends React.Component<NavHeaderProps> {
  @observable
  showModal: boolean
  @observable
  showImportAccountBox: boolean

  /**
   * life circle
   */
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

  /**
   * turn to
   */
  turnToAccounts = () => {
    this.props.history!.historyPush(APP_STATE.ACCOUNT_PAGE)
  }

  turnToCreateAccount = () => {
    this.props.history!.historyPush(APP_STATE.CREATE_ACCOUNT_PAGE)
  }

  turnToSetting = () => {
    this.props.history!.historyPush(APP_STATE.SETTING_PAGE)
  }

  stopPropagation = e => {
    // e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }

  /**
   * ShowModal
   */
  @action
  setShowModal = (flag: boolean) => {
    this.showModal = flag
  }

  handleShowModal = e => {
    // e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    this.setShowModal(true)
  }

  handleHideModal = () => {
    this.setShowModal(false)
  }

  changeActiveAccount = (id: string) => () => {
    this.props.account!.changeCurrentAccount(id)
  }

  /**
   * ShowImportAccountBox
   */
  @action
  setShowImportAccountBox = (flag: boolean) => {
    this.showImportAccountBox = flag
  }

  handleShowImportAccountBox = () => {
    this.setShowImportAccountBox(true)
    this.setShowModal(false)
  }

  handleCloseImportAccountBox = () => {
    this.setShowImportAccountBox(false)
  }

  render() {
    const appState = this.props.history!.appState
    const accountList = this.props.account!.accountList
    const activeAccount = this.props.account!.activeAccount
    return (
      <Fragment>
        {this.showImportAccountBox && (
          <ImportAccount
            account={this.props.account as any}
            onClose={this.handleCloseImportAccountBox}
            label={this.props.label!.label}
            layout={this.props.layout as any}
          />
        )}
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
                <span className="nav-myAccount">{this.props.label!.label.account.myAccounts}</span>
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
              <div className="nav-setting-box nav-import-account-box" onClick={this.handleShowImportAccountBox}>
                <span className="nav-import-account-icon" />
                <span className="nav-setting-word">{this.props.label!.label.setting.importAccount}</span>
              </div>
              <div className="nav-setting-box" onClick={this.turnToSetting}>
                <span className="nav-setting-icon" />
                <span className="nav-setting-word">{this.props.label!.label.setting.setting}</span>
              </div>
            </div>
          )}
        </div>
      </Fragment>
    )
  }
}

export default NavHeader
