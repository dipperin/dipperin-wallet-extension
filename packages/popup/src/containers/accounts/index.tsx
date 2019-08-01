import React from 'react'
// import { observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'

import Account from '@/stores/account'
import History from '@/stores/history'
import Label from '@/stores/label'

// import AccountInfo from './accountInfo'
import NavHeader from '@/components/navHeader'
import AccountInfo from './accountInfo'
import './accountsStyle.css'

import { APP_STATE } from '@dipperin/lib/constants'
// import { action, observable, autorun } from 'mobx'
import Button from '@/components/button'
import txRecordIcon from '../../images/txRecord.png'

const { SEND_PAGE, TX_RECORD } = APP_STATE

interface AccountsProps {
  account?: Account
  history?: History
  label?: Label
}

@inject('account', 'history', 'label')
@observer
class Accounts extends React.Component<AccountsProps> {
  constructor(props) {
    super(props)
  }

  turnToSend = () => {
    this.props.history!.historyPush(SEND_PAGE)
  }

  turnToTxRecord = () => {
    this.props.history!.historyPush(TX_RECORD)
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
          {this.props.label!.label.extension.account.send}
        </Button>
        <p className="accounts-txRecordLink" onClick={this.turnToTxRecord}>
          <img src={txRecordIcon} className="accounts-txRecordIcon" />
          {this.props.label!.label.extension.account.seeTxs}
        </p>
      </div>
    )
  }
}

export default Accounts
