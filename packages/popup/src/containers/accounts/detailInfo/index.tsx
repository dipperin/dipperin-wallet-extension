import React, { Component, Fragment } from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import QRCode from 'qrcode'

import AccountStore from '@/stores/account'
import Layout from '@/stores/layout'

import { I18nCollection } from '@/i18n'

import './styles.css'

interface Props {
  account: AccountStore
  onClose: () => void
  label: I18nCollection
  layout: Layout
}

enum page {
  account,
  password,
  privateKey
}

@observer
class DetailInfo extends Component<Props> {
  @observable
  currentPage: number = page.account

  @observable
  ifRename: boolean = false

  @observable
  newName: string = ''

  @observable
  password: string = ''
  @observable
  privateKey: string = ''

  qrcode: HTMLCanvasElement

  nameInput: HTMLInputElement

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const address = this.props.account.activeAccount.address
    this.showQrcode(address)
    // reaction(
    //   () => this.props.account!.activeAccount,
    //   () => {
    //     this.showQrcode(this.props.account!.activeAccount.address)
    //   }
    // )
  }

  @action
  setIfRename = (flag: boolean) => {
    this.ifRename = flag
  }

  @action
  setNewName = (name: string) => {
    this.newName = name
  }

  @action
  changePsw = (key: string) => {
    this.password = key
  }

  handleRename = () => {
    const activeAccountName = this.props.account.activeAccount.name
    this.setNewName(activeAccountName)

    this.setIfRename(true)
  }

  handleFinishRename = () => {
    // process new name
    this.changeAccountName()

    this.setNewName('')

    this.setIfRename(false)
  }

  isCN(str) {
    const regexCh = /[u00-uff]/
    return !regexCh.test(str)
  }

  verifyAccountName() {
    const MAXLENGHT = 20
    let strlenght = 0
    const txtval = this.newName
    for (let i = 0; i < txtval.length; i++) {
      if (this.isCN(txtval.charAt(i)) === true) {
        strlenght = strlenght + 2
      } else {
        strlenght = strlenght + 1
      }
    }
    return strlenght > MAXLENGHT ? false : true
  }

  handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value

    this.setNewName(name)
  }

  refQrcode = (instance: HTMLCanvasElement) => {
    this.qrcode = instance
  }

  refNameInput = (instance: HTMLInputElement) => {
    this.nameInput = instance
    if (instance) {
      instance.focus()
    }
  }

  showQrcode = (address: string) => {
    // const canvas = document.getElementById('qrcode')
    const canvas = this.qrcode
    if (!canvas) {
      return
    }
    QRCode.toCanvas(canvas, address, {
      color: {
        light: '#f2f5f6'
      },
      width: '136'
    })
  }

  preventDefault = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  copyAddress = () => {
    const address = this.props.account!.activeAccount.address
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.setAttribute('value', address)
    input.select()
    if (document.execCommand('copy')) {
      document.execCommand('copy')
      // this.showTooltip()
    }
    document.body.removeChild(input)

    this.props.layout.displayModal(this.props.label.account.copySuccess)
    setTimeout(() => {
      this.props.layout.closeModal()
    }, 1500)
  }

  @action
  handleTurnToExportPrivateKey = () => {
    this.currentPage = page.password
  }

  handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPsw = e.target.value
    this.changePsw(newPsw)
  }

  @action
  handleConfirmPsw = async () => {
    try {
      const priv = await this.props.account.getPrivateKey(this.password)
      if (/^(0x)?[0-9a-f]{64}$/.test(priv)) {
        this.privateKey = priv
        this.currentPage = page.privateKey
        return
      }
    } catch (e) {
      console.log('getPrivateKey error', e)
    }

    this.props.layout.displayModal(this.props.label.account.invalidPsw)
    setTimeout(() => {
      this.props.layout.closeModal()
    }, 3000)
  }

  changeAccountName = () => {
    if (!this.verifyAccountName) {
      // TODO: use tooltip
      alert(this.props.label.account.accountName)
      this.newName = this.props.account!.activeAccount.name
      return
    }
    const param = {
      id: this.props.account!.activeAccount.id,
      name: this.newName
    }

    this.setIfRename(false)

    this.props
      .account!.updateAccountName(param)!
      .then(res => {
        this.props.account!.updateAccountStore()
        console.log('accounts-changeAccount-res', res)
      })!
      .catch(e => {
        console.log('accounts-changeAccount-error', e)
      })
  }

  copyPriv = () => {
    const priv = this.privateKey
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.setAttribute('value', priv)
    input.select()
    if (document.execCommand('copy')) {
      document.execCommand('copy')
      // this.showTooltip()
    }
    document.body.removeChild(input)

    this.props.layout.displayModal(this.props.label.account.copySuccess)
    setTimeout(() => {
      this.props.layout.closeModal()
    }, 1500)
  }

  render() {
    const { onClose, label } = this.props
    return (
      <div className="modal-curtain" onClick={onClose}>
        <div className="accounts-modal" onClick={this.preventDefault}>
          <span className="accounts-close" onClick={onClose}>
            ×
          </span>
          {this.currentPage === page.account && (
            <Fragment>
              <div className="accounts-account-name-row">
                {!this.ifRename && (
                  <span className="accounts-account-name">
                    {this.props.account.activeAccount.name}
                    <span className="accounts-account-copy" onClick={this.handleRename} />
                  </span>
                )}
                {this.ifRename && (
                  <input
                    value={this.newName}
                    className="accounts-account-rename"
                    onChange={this.handleNameChange}
                    onBlur={this.handleFinishRename}
                    ref={this.refNameInput}
                  />
                )}
              </div>

              <div className="accounts-qrcode-block">
                <canvas id="qrcode" ref={this.refQrcode} onClick={this.copyAddress} />
                <div className="accounts-account-address-block">
                  <span className="accounts-account-address" onClick={this.copyAddress}>
                    {this.props.account.activeAccount.address}
                  </span>
                </div>
              </div>

              <div className="accounts-modal-box">
                <button className="accounts-btn-prv" onClick={this.handleTurnToExportPrivateKey}>
                  {this.props.label.account.exportPrivateKey}
                </button>
              </div>
            </Fragment>
          )}
          {this.currentPage === page.password && (
            <Fragment>
              <div className="accounts-account-name-row">
                <span className="accounts-account-name">{label.account.showPrivateKey}</span>
              </div>

              <div className="accounts-modal-psw-block">
                <p className="accounts-modal-psw-label">{label.account.pleaseEnterPsw}</p>
                <input
                  className="accounts-modal-psw-input"
                  type="password"
                  value={this.password}
                  onChange={this.handleChangePassword}
                />
              </div>

              <div className="accounts-modal-notes-block">
                <p className="accounts-modal-notes">{label.account.privNote}</p>
              </div>

              <div className="accounts-modal-box">
                <button className="accounts-btn-prv" onClick={this.handleConfirmPsw}>
                  {label.account.confirm}
                </button>
              </div>
            </Fragment>
          )}
          {this.currentPage === page.privateKey && (
            <Fragment>
              <div className="accounts-account-name-row">
                <span className="accounts-account-name">{label.account.showPrivateKey}</span>
              </div>

              <div className="accounts-modal-psw-block">
                <p className="accounts-modal-psw-label">{label.account.yourPriv}</p>
                <p className="accounts-modal-priv-show" onClick={this.copyPriv}>
                  {this.privateKey}
                </p>
              </div>

              <div className="accounts-modal-notes-block">
                <p className="accounts-modal-notes">{label.account.privNote}</p>
              </div>

              <div className="accounts-modal-box">
                <button className="accounts-btn-prv" onClick={this.handleConfirmPsw}>
                  {label.account.done}
                </button>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    )
  }
}

export default DetailInfo
