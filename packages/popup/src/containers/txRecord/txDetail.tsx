import React from 'react'
// import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import { Utils } from '@dipperin/dipperin.js'

interface TransactionObj {
  nonce: string
  value: string
  hashLock: string
  to: string
  from: string
  extraData?: string
  fee?: string
  status?: string
  timeLock?: number
  timestamp?: number
  transactionHash?: string
  uuid?: string
}

interface Props {
  transaction: TransactionObj
  onClose: () => void
}

@observer
class TxDetail extends React.Component<Props> {
  handleClose = () => {
    this.props.onClose()
  }

  formatBalance = (amount?: string) => {
    let ret: string = ''
    if (amount) {
      ret = `${Number(Utils.fromUnit(amount)).toLocaleString()} DIP`
    }
    return ret
  }

  formatDate = (timestamp: number) => {
    const t = new Date(timestamp)
    return t.toString()
  }

  render() {
    const { transaction } = this.props
    return (
      <div className="txRecord-box">
        <span className="setting-close-icon" onClick={this.handleClose} />
        <p className="txRecord_row">
          <span className="txRecord_th">Value:</span>
          <span className="txRecord_td">{this.formatBalance(transaction.value)}</span>
        </p>
        <p className="txRecord_row">
          <span className="txRecord_th">timestamp:</span>
          <span className="txRecord_td">{transaction.timestamp ? this.formatDate(transaction.timestamp) : ''}</span>
        </p>
        <p className="txRecord_row">
          <span className="txRecord_th">Nonce:</span>
          <span className="txRecord_td">{transaction.nonce}</span>
        </p>
        <p className="txRecord_row">
          <span className="txRecord_th">Extra Data:</span>
          <span className="txRecord_td">{transaction.extraData}</span>
        </p>
        <p className="txRecord_row">
          <span className="txRecord_th">From:</span>
          <span className="txRecord_td">{transaction.from}</span>
        </p>
        <p className="txRecord_row">
          <span className="txRecord_th">To:</span>
          <span className="txRecord_td">{transaction.to}</span>
        </p>
        <p className="txRecord_row">
          <span className="txRecord_th">Hash:</span>
          <span className="txRecord_td">{transaction.transactionHash}</span>
        </p>
        <p className="txRecord_row">
          <span className="txRecord_th">State:</span>
          <span className="txRecord_td">{transaction.status}</span>
        </p>
      </div>
    )
  }
}

export default TxDetail
