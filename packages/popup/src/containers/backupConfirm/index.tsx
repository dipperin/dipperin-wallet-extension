import React from 'react'
import { observable, action, computed } from 'mobx'
import { observer, inject } from 'mobx-react'
import _ from 'lodash'

import { APP_STATE } from '@dipperin/lib/constants'
import Wallet from '@/stores/wallet'
import History from '@/stores/history'
import Layout from '@/stores/layout'
import Button from '@/components/button'
import AppHeader from '@/components/header'
import { popupLog as log } from '@dipperin/lib/log'

import RandomMnemonic from './randomMnemonic'
import './backupConfirmStyle.css'

const { HAS_NO_WALLET, BACKUP_PAGE, ACCOUNT_PAGE } = APP_STATE

interface Props {
  wallet?: Wallet
  history?: History
  layout?: Layout
}

@inject('wallet', 'history', 'layout')
@observer
class BackupConfirm extends React.Component<Props> {
  @observable
  mnemonic: string

  @observable
  seletedMnemonic: number[] = []

  @computed
  get verifySelectMnemonic() {
    return _.isEqual(this.seletedMnemonic, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
  }

  @action
  updateseleted = (selected: number[]) => {
    this.seletedMnemonic = selected
  }

  constructor(props) {
    super(props)
    this.getMnemonic()
  }

  @action
  setMnemonic = (mnemonic: string) => {
    this.mnemonic = mnemonic
  }

  toBackup = () => {
    this.props.history!.historyPush(BACKUP_PAGE)
  }

  toQuit = () => {
    this.props.history!.historyPush(HAS_NO_WALLET)
  }

  toAccount = () => {
    this.props.history!.historyPush(ACCOUNT_PAGE)
  }

  getMnemonic = async () => {
    try {
      const res = (await this.props.wallet!.getMnenmonic()) as string
      this.setMnemonic(res)
    } catch (e) {
      log.error('backupConfirm-getMnemonic-error:' + e)
    }
  }

  finishCreate = async () => {
    this.props.layout!.handleOpenLoading()
    try {
      const res = await this.props.wallet!.createWallet()
      log.debug('BackupConfirm-createWallet-result:' + res)
      this.props.layout!.handleCloseLoading(this.toAccount)
    } catch (e) {
      this.props.layout!.handleOpenLoading()
      log.error('BackupConfirm-createWallet-result-error:' + e)
    }
  }

  handleFinishCreate = _.throttle(this.finishCreate, 4000, { trailing: false })

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
        <AppHeader />
        <div className="backupConfirm-modal">
          <p className="g-p-info">
            Please copy down the mnemonic for your new account below. You will have to confirm the mnemonic on the next
            screen
          </p>

          {this.mnemonic && <RandomMnemonic mnemonic={this.mnemonic} changeSelect={this.updateseleted} />}

          <p className="g-p-info">{this.seletedMnemonic.map(item => this.mnemonic.split(' ')[item]).join(' ')}</p>
        </div>

        <div className="g-2btn-area">
          <Button params={btnCancel} onClick={this.toBackup}>
            Cancel
          </Button>
          <Button params={btnConfirm} disabled={!this.verifySelectMnemonic} onClick={this.handleFinishCreate}>
            Confirm
          </Button>
        </div>
        {/* <Loading show={this.loadingHandler.show} /> */}
      </div>
    )
  }
}

export default BackupConfirm
