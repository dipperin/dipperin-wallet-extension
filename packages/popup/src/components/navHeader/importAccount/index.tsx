import React, { Component } from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'

import AccountStore from '@/stores/account'

import { I18nCollection } from '@/i18n'

import './styles.css'

interface Props {
  account: AccountStore
  label: I18nCollection
  onClose: () => void
}

@observer
class ImportAccount extends Component<Props> {
  @observable
  privateKey: string

  @action
  changePrivate = (priv: string) => {
    this.privateKey = priv
  }

  handleChangePriv = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.changePrivate(e.target.value)
  }

  handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  handleImportAccount = () => {
    return
  }

  render() {
    const { onClose, label } = this.props
    return (
      <div className="import-account-curtain" onClick={onClose}>
        <div className="import-account-modal" onClick={this.handleModalClick}>
          <span className="import-account-close" onClick={onClose}>
            ×
          </span>
          <div className="import-account-title-row">
            <span className="import-account-name">{label.account.showPrivateKey}</span>
          </div>
          <div className="import-account-modal-psw-block">
            <p className="import-account-modal-psw-label">{label.account.yourPriv}</p>
            <textarea
              className="import-account-modal-priv-show"
              value={this.privateKey}
              onChange={this.handleChangePriv}
            >
              {this.privateKey}
            </textarea>
          </div>
          <div className="import-account-modal-box">
            <button className="import-account-btn-prv" onClick={this.handleImportAccount}>
              {label.account.done}
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default ImportAccount
