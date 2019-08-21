import React from 'react'
import { observable } from 'mobx'
import { inject, observer } from 'mobx-react'

import History from '@/stores/history'
import Wallet from '@/stores/wallet'
import Label from '@/stores/label'
import './authStyle.css'
import Button from '@/components/button'
import { popupLog as log } from '@dipperin/lib/log'

interface AuthProps {
  wallet?: Wallet
  history?: History
  label?: Label
}

@inject('wallet', 'history', 'label')
@observer
class Auth extends React.Component<AuthProps> {
  @observable
  appName: string = ''
  constructor(props) {
    super(props)
    this.adjustWindow()
    this.autoCloseWindow()
    this.getAppName()
  }

  getAppName = async () => {
    this.props
      .wallet!.getAppName()!
      .then(data => {
        // console.log('appname', data)
        this.appName = data as string
      })
      .catch(e => console.log('getAppName error', e))
  }

  autoCloseWindow = () => {
    setTimeout(() => {
      this.toClose()
    }, 200000)
  }

  toClose = () => {
    window.opener = null
    window.open('', '_self')
    window.close()
  }

  adjustWindow = () => {
    const innerHeight = window.innerHeight
    const innerWidth = window.innerWidth
    const targetHeight = 490
    const targetWidth = 360
    window.resizeBy(targetWidth - innerWidth, targetHeight - innerHeight)
  }

  agreeAuth = async () => {
    // FIXME: add alert!
    try {
      await this.props.wallet!.confirmAuth()
      alert('login success!')
    } catch (e) {
      log.error('auth-agreeAuth:' + e)
    }
  }
  // TODO: add logic
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
        <div className="dipperin-logo auth-logo" />
        <h1 className="auth-title">{this.appName}</h1>
        {/* // TODO: fix to a var */}
        <p className="g-p-info auth-info">{this.props.label!.label.send.authTip}</p>
        <div className="g-2btn-area auth-btn">
          <Button params={btnCancel} onClick={this.toClose}>
            {this.props.label!.label.wallet.cancel}
          </Button>
          <Button params={btnConfirm} onClick={this.agreeAuth}>
            {this.props.label!.label.wallet.confirm}
          </Button>
        </div>
      </div>
    )
  }
}

export default Auth
