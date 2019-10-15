import React, { Component, Fragment } from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import QRCode from 'qrcode'

import AccountStore from '@/stores/account'

import './styles.css'

interface Props {
  account: AccountStore
  onClose: () => void
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

  qrcode: HTMLCanvasElement

  nameInput: HTMLInputElement

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const address = '0x000085E15e074806F1d123a2Bd925D2c60D627Fd8b2e'
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

  handleRename = () => {
    this.setNewName('account 1')

    this.setIfRename(true)
  }

  handleFinishRename = () => {
    // process new name
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
  }

  @action
  handleTurnToExportPrivateKey = () => {
    this.currentPage = page.password
  }

  @action
  handleConfirmPsw = () => {
    this.currentPage = page.privateKey
  }

  render() {
    const { onClose } = this.props
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
                    Account
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
                <canvas id="qrcode" ref={this.refQrcode} />
                <div className="accounts-account-address-block">
                  <span className="accounts-account-address">0x000085E15e074806F1d123a2Bd925D2c60D627Fd8b2e</span>
                </div>
              </div>

              <div className="accounts-modal-box">
                <button className="accounts-btn-prv" onClick={this.handleTurnToExportPrivateKey}>
                  Export Private Keys
                </button>
              </div>
            </Fragment>
          )}
          {this.currentPage === page.password && (
            <Fragment>
              <div className="accounts-account-name-row">
                <span className="accounts-account-name">Show Private Keys</span>
              </div>

              <div className="accounts-modal-psw-block">
                <p className="accounts-modal-psw-label">输入你的密码</p>
                <input className="accounts-modal-psw-input" />
              </div>

              <div className="accounts-modal-notes-block">
                <p className="accounts-modal-notes">
                  注意：请保管好这个私钥。任何人拥有了你的私钥都可以窃取你帐户中的所有资产。
                </p>
              </div>

              <div className="accounts-modal-box">
                <button className="accounts-btn-prv" onClick={this.handleConfirmPsw}>
                  Confirm
                </button>
              </div>
            </Fragment>
          )}
          {this.currentPage === page.privateKey && (
            <Fragment>
              <div className="accounts-account-name-row">
                <span className="accounts-account-name">Show Private Keys</span>
              </div>

              <div className="accounts-modal-psw-block">
                <p className="accounts-modal-psw-label">这是你的私钥（点击复制）</p>
                <input className="accounts-modal-priv-show" />
              </div>

              <div className="accounts-modal-notes-block">
                <p className="accounts-modal-notes">
                  注意：请保管好这个私钥。任何人拥有了你的私钥都可以窃取你帐户中的所有资产。
                </p>
              </div>

              <div className="accounts-modal-box">
                <button className="accounts-btn-prv" onClick={this.handleConfirmPsw}>
                  Confirm
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
