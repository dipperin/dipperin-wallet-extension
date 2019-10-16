import React, { Component } from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'

import AccountStore from '@/stores/account'
import Layout from '@/stores/layout'

import { I18nCollection } from '@/i18n'

import './styles.css'

interface Props {
  account: AccountStore
  label: I18nCollection
  onClose: () => void
  layout: Layout
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

  handleImportAccount = async () => {
    const result = await this.props.account.importPrivateKey(this.privateKey)
    if (result) {
      this.props.layout.displayModal(this.props.label.account.importSuccess)
      setTimeout(() => this.props.layout.closeModal(), 3000)
    } else {
      this.props.layout.displayModal(this.props.label.account.importFailure)
      setTimeout(() => this.props.layout.closeModal(), 3000)
    }
    this.props.onClose()
    location.reload()
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
            <p className="import-account-modal-psw-label">{label.account.enterPriv}</p>
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
