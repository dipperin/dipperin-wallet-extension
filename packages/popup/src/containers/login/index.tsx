import React from 'react'
import { inject, observer } from 'mobx-react'

import { APP_STATE } from '@dipperin/lib/constants'
import History from '@/stores/history'
import Button from '@/components/button'

import './loginStyle.css'

const { IMPORT_WALLET_PAGE, SET_PASSWORD } = APP_STATE

interface LoginProps {
  history?: History
}

@inject('history')
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
          Import Account
        </Button>
        <Button params={btnToCreate} onClick={this.handlePushToCreate}>
          Create Account
        </Button>
      </div>
    )
  }
}

export default Login
