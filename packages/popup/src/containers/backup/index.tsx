import React from 'react'
import { observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'
import _ from 'lodash'
// import './loginStyle.css'

// import RootStore from '@/stores/root'
import Wallet from '@/stores/wallet'
import History from '@/stores/history'
import { popupLog as log } from '@dipperin/lib/log'

import Button from '@/components/button'
import AppHeader from '@/components/header'

import { APP_STATE } from '@dipperin/lib/constants'
import './backupStyle.css'

const { HAS_NO_WALLET, SET_PASSWORD, BACKUP_CONFIRM } = APP_STATE

interface Props {
  wallet?: Wallet
  history?: History
}

@inject('wallet', 'history')
@observer
class Backup extends React.Component<Props> {
  @observable
  currentStep = '0'

  @observable
  mnemonic: string

  constructor(props) {
    super(props)
    this.getMnemonic()
  }

  @action
  setMnemonic = (mnemonic: string) => {
    this.mnemonic = mnemonic
  }

  toSetPassword = () => {
    this.props.history!.historyPush(SET_PASSWORD)
  }

  toBackupConfirm = () => {
    this.props.history!.historyPush(BACKUP_CONFIRM)
  }

  toQuit = () => {
    this.props.history!.historyPush(HAS_NO_WALLET)
  }

  getMnemonic = async () => {
    this.props
      .wallet!.getMnenmonic()!
      .then((res: string) => {
        this.setMnemonic(res)
      })
      .catch(e => {
        log.error('CreateLayout-create-error:' + e)
      })
  }

  render() {
    const btnCancel = {
      classes: [],
      color: 'gray',
      size: 'small',
      float: 'left'
    }
    const btnConfirm = {
      classes: [],
      color: 'blue',
      size: 'small',
      float: 'right'
    }
    return (
      <div className="bg-blue">
        <AppHeader />
        <div className="backup-modal">
          <p className="g-p-info">
            Please copy down the mnemonic for your new account below. You will have to confirm the mnemonic on the next
            screen
          </p>

          <textarea className="g-text-mnemonic backup-mnemonic" value={this.mnemonic} readOnly={true} />
        </div>

        <div className="g-2btn-area">
          <Button params={btnCancel} onClick={this.toSetPassword}>
            Cancel
          </Button>
          <Button params={btnConfirm} onClick={this.toBackupConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    )
  }
}

export default Backup
