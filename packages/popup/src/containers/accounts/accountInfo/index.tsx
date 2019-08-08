import React, { Fragment } from 'react'
import { observable, action, autorun, computed } from 'mobx'
import { observer, inject } from 'mobx-react'

import Account from '@/stores/account'
import Label from '@/stores/label'
import Tooltip from '@/components/tooltip'
import { genAvatar } from '@/utils'
// image
import WhiteLock from '@/images/whiteLock.png'

interface AccountInfoProps {
  account?: Account
  label?: Label
}

@inject('account', 'label')
@observer
class AccountInfo extends React.Component<AccountInfoProps> {
  @observable
  inputAccount: boolean = false

  @observable
  accountName: string = ''

  @observable
  displayTooltip: boolean

  nameInput: HTMLInputElement

  @action
  openInputAccount = () => {
    this.inputAccount = true
  }

  @action
  closeInputAccount = () => {
    this.inputAccount = false
  }

  @action
  handleChangeName = e => {
    this.accountName = e.target.value
  }

  constructor(props) {
    super(props)
    // this.props.account!.updateAccountStore()
    autorun(() => {
      this.accountName = this.props.account!.activeAccount.name
    })
  }

  isCN(str) {
    const regexCh = /[u00-uff]/
    return !regexCh.test(str)
  }

  @computed
  get verifyAccountName() {
    const MAXLENGHT = 20
    let strlenght = 0
    const txtval = this.accountName
    for (let i = 0; i < txtval.length; i++) {
      if (this.isCN(txtval.charAt(i)) === true) {
        strlenght = strlenght + 2
      } else {
        strlenght = strlenght + 1
      }
    }
    return strlenght > MAXLENGHT ? false : true
  }

  refinput = instance => {
    // auto focus input element
    this.nameInput = instance
    if (instance) {
      instance.focus()
    }
  }

  changeAccountName = () => {
    if (!this.verifyAccountName) {
      // TODO: use tooltip
      alert(this.props.label!.label.account.accountName)
      this.accountName = this.props.account!.activeAccount.name
      return
    }
    const param = {
      id: this.props.account!.activeAccount.id,
      name: this.accountName
    }

    this.closeInputAccount()

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

  copyAddress = () => {
    const address = this.props.account!.activeAccount.address
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.setAttribute('value', address)
    input.select()
    if (document.execCommand('copy')) {
      document.execCommand('copy')
      // TODO: add alert to tell user Replicating Success
      this.showTooltip()
      // alert('Replicating Success!')
    }
    document.body.removeChild(input)
  }

  handleKeyDown = e => {
    if (e.keyCode === 13) {
      this.changeAccountName()
    }
  }

  formatAddress = address => {
    const frontPart = address
      .split('')
      .slice(0, 17)
      .join('')
    const backPart = address
      .split('')
      .slice(29, 46)
      .join('')
    return `${frontPart}...${backPart}`
  }

  @action
  toggleDisplayTooltip = () => {
    this.displayTooltip = !this.displayTooltip
  }

  showTooltip = () => {
    this.displayTooltip = true
    setTimeout(() => {
      this.displayTooltip = false
    }, 2000)
  }

  formatNumber = (num: number, w: number) => {
    const m = 10 ** w
    const b = Math.floor(num * m) / m
    return b.toLocaleString('zh-Hans', {
      maximumFractionDigits: w
    })
  }

  render() {
    const activeAccount = this.props.account!.activeAccount
    const copyTip = this.props.label!.label.account.copySuccess
    return (
      <div className="accounts-content">
        <div className="accounts-id-box">
          {/* <span className="accounts-id">{activeAccount.id}</span> */}
          <img className="accounts-avatar" src={genAvatar(activeAccount.address, 80)} alt="" />
        </div>

        <div className="accounts-name-box">
          {!this.inputAccount && (
            <Fragment>
              <span className="accounts-name-nothing" />
              <span className="accounts-name">{this.accountName ? this.accountName : activeAccount.name}</span>
              <span className="accounts-name-icon" onClick={this.openInputAccount} />
            </Fragment>
          )}
          {this.inputAccount && (
            <Fragment>
              <div className="accounts-hr-line" />
              <input
                className="accounts-name-input"
                value={this.accountName}
                onBlur={this.changeAccountName}
                onChange={this.handleChangeName}
                onKeyDown={this.handleKeyDown}
                ref={this.refinput}
              />
              <div className="accounts-hr-line" />
            </Fragment>
          )}
        </div>

        <div className="accounts-balance-box">
          {/* <span className="accounts-balance">{`${activeAccount.balance} DIP`}</span> */}
          <span
            className="accounts-balance"
            title={`${Number(activeAccount.balance).toLocaleString('zh-Hans', {
              maximumFractionDigits: 18
            })} DIP`}
          >{`${this.formatNumber(Number(activeAccount.balance), 6)} DIP`}</span>
        </div>

        {activeAccount.lockBalance && activeAccount.lockBalance !== '0' && (
          <div className="accounts-lockbalance-box">
            <img src={WhiteLock} />
            <span
              className="accounts-lockbalance"
              title={`${Number(activeAccount.lockBalance).toLocaleString('zh-Hans', {
                maximumFractionDigits: 18
              })} DIP`}
            >{` ${this.formatNumber(Number(activeAccount.lockBalance), 6)} DIP`}</span>
          </div>
        )}

        <div className="accounts-address-box">
          <span className="accounts-name-nothing" />
          <span className="accounts-address" title={activeAccount.address}>
            {this.formatAddress(activeAccount.address)}
          </span>
          <Tooltip position="topleft" message={copyTip} displayTooltip={this.displayTooltip}>
            <span className="accounts-address-icon" onClick={this.copyAddress} />
          </Tooltip>
        </div>
      </div>
    )
  }
}

export default AccountInfo
