import React from 'react'
import { inject, observer } from 'mobx-react'

import { APP_STATE } from '@dipperin/lib/constants'
import History from '@/stores/history'
import Label from '@/stores/label'
import Button from '@/components/button'

import './loginStyle.css'

const { IMPORT_WALLET_PAGE, SET_PASSWORD } = APP_STATE

interface LoginProps {
  history?: History
  label?: Label
}

@inject('history', 'label')
@observer
class Login extends React.Component<LoginProps> {
  handlePushToImport = () => {
    this.props.history!.historyPush(IMPORT_WALLET_PAGE)
  }

  handlePushToCreate = () => {
    this.props.history!.historyPush(SET_PASSWORD)
  }

  render() {
    const btnToImport = {
      classes: ['login-import'],
      color: 'blue'
    }
    const btnToCreate = {
      classes: ['login-create'],
      color: 'cyan'
    }
    return (
      <div className="bg-blue">
        <div className="dipperin-logo login-logo" />
        <h1 className="login-title g-title-v1">DipperinLink</h1>
        <Button params={btnToImport} onClick={this.handlePushToImport}>
          {this.props.label!.label.wallet.importWallet}
        </Button>
        <Button params={btnToCreate} onClick={this.handlePushToCreate}>
          {this.props.label!.label.wallet.createWallet}
        </Button>
      </div>
    )
  }
}

export default Login
