import React from 'react'
// import { observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'

import Account from '@/stores/account'
import History from '@/stores/history'

// import AccountInfo from './accountInfo'
import NavHeader from '@/components/navHeader'
import AccountInfo from './accountInfo'
import './accountsStyle.css'

import { APP_STATE } from '@dipperin/lib/constants'
// import { action, observable, autorun } from 'mobx'
import Button from '@/components/button'

const { SEND_PAGE } = APP_STATE

interface AccountsProps {
  account?: Account
  history?: History
}

@inject('account', 'history')
@observer
class Accounts extends React.Component<AccountsProps> {
  constructor(props) {
    super(props)
  }

  turnToSend = () => {
    this.props.history!.historyPush(SEND_PAGE)
  }

  render() {
    const activeAccount = this.props.account!.activeAccount
    const btnSend = {
      classes: ['accounts-btn-box'],
      size: 'middle'
    }
    return (
      <div className="bg-blue">
        <NavHeader />

        {activeAccount && <AccountInfo />}

        <Button params={btnSend} onClick={this.turnToSend}>
          Send
        </Button>
      </div>
    )
  }
}

export default Accounts
