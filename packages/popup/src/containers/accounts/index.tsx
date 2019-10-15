import React from 'react'
import { observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'

import Account from '@/stores/account'
import History from '@/stores/history'
import Label from '@/stores/label'

// import AccountInfo from './accountInfo'
import NavHeader from '@/components/navHeader'
import DetailInfo from './detailInfo'
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
  @observable
  showDetail: boolean = false

  constructor(props) {
    super(props)
  }

  @action
  setShowDetail = (flag: boolean) => {
    this.showDetail = flag
  }

  handleShowDetail = () => {
    this.setShowDetail(true)
  }

  handleCloseShowDetail = () => {
    this.setShowDetail(false)
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

        {activeAccount && <AccountInfo showDetail={this.handleShowDetail} />}

        <Button params={btnSend} onClick={this.turnToSend}>
          {this.props.label!.label.account.send}
        </Button>
        <p className="accounts-txRecordLink" onClick={this.turnToTxRecord}>
          <img src={txRecordIcon} className="accounts-txRecordIcon" />
          {this.props.label!.label.account.seeTxs}
        </p>

        {this.showDetail && (
          <DetailInfo
            label={this.props.label!.label}
            account={this.props.account as any}
            onClose={this.handleCloseShowDetail}
          />
        )}
      </div>
    )
  }
}

export default Accounts
