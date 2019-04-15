import React from 'react'
import { inject, observer } from 'mobx-react'

import History from '@/stores/history'
import Wallet from '@/stores/wallet'
import './authStyle.css'
import Button from '@/components/button'
import { popupLog as log } from '@dipperin/lib/log'

interface AuthProps {
  wallet?: Wallet
  history?: History
}

@inject('wallet', 'history')
@observer
class Auth extends React.Component<AuthProps> {
  constructor(props) {
    super(props)
    this.adjustWindow()
    this.autoCloseWindow()
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
        <h1 className="auth-title">Rich Bet</h1>
        <p className="g-p-info auth-info">Request authorization, do you agree?</p>
        <div className="g-2btn-area auth-btn">
          <Button params={btnCancel} onClick={this.toClose}>
            Cancel
          </Button>
          <Button params={btnConfirm} onClick={this.agreeAuth}>
            Confirm
          </Button>
        </div>
      </div>
    )
  }
}

export default Auth
