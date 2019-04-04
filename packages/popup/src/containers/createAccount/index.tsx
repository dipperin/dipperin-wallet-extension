import React from 'react'
import { observable, computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import _ from 'lodash'

import Account from '@/stores/account'
import History from '@/stores/history'
import NavHeader from '@/components/navHeader'
import HrLine from '@/components/hrLine'
import Tooltip from '@/components/tooltip'

import { APP_STATE } from '@dipperin/lib/constants'
import './createAccountStyle.css'
import Button from '@/components/button'

const { ACCOUNT_PAGE } = APP_STATE

interface CreateAccountProps {
  account?: Account
  history?: History
}

@inject('account', 'history')
@observer
class CreateAccount extends React.Component<CreateAccountProps> {
  @observable
  accountName = ''

  @observable
  tooltipMsg = ''

  @observable
  displayTooltip = false

  handleInputAccountName = e => {
    this.accountName = e.target.value
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

  createAccount = () => {
    if (!this.verifyAccountName) {
      this.showTip('The account name is limited to 10 characters or 20 letter.')
      // alert('The account name is limited to 10 characters or 20 letter.')
      return
    }
    this.props
      .account!.addAccount(this.accountName)!
      .then(res => {
        console.log('createAccount-handleCreateAccount-res:', res)
      })
      .catch(e => {
        console.log('createAccount-handleCreateAccount-error:', e)
      })
    this.props.history!.historyPush(ACCOUNT_PAGE)
  }

  handleCreateAccount = _.throttle(this.createAccount, 1000)

  handleCancel = () => {
    this.props.history!.historyPush(ACCOUNT_PAGE)
  }

  handleonKeyDown = e => {
    if (e.keyCode === 13 && this.accountName) {
      this.handleCreateAccount()
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
    const btnCancel = {
      classes: [],
      color: 'gray',
      float: 'left',
      size: 'small'
    }
    const btnConfirm = {
      classes: [],
      color: 'blue',
      float: 'right',
      size: 'small'
    }
    return (
      <div className="bg-blue">
        <NavHeader />
        <HrLine />

        <div className="ca-close-box">
          <span className="ca-close-icon" onClick={this.handleCancel} />
        </div>
        <div className="ca-label">Account Name</div>
        <div className="ca-input-box">
          <Tooltip position="bottom" message={this.tooltipMsg} displayTooltip={this.displayTooltip} size={310}>
            <input
              type="text"
              className="g-input-v2"
              value={this.accountName}
              onChange={this.handleInputAccountName}
              onKeyDown={this.handleonKeyDown}
            />
          </Tooltip>
        </div>
        <div className="g-2btn-area ca-btn-box">
          <Button params={btnCancel} onClick={this.handleCancel}>
            Cancel
          </Button>
          <Button params={btnConfirm} disabled={!this.accountName} onClick={this.handleCreateAccount}>
            Confirm
          </Button>
        </div>
      </div>
    )
  }
}

export default CreateAccount
