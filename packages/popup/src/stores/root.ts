import { Popup, PopupType } from '@dipperin/lib/duplex'
import API from '@/api'

import Account from './account'
import History from './history'
import Wallet from './wallet'
import Transaction from './transaction'
import Layout from './layout'
import Label from './label'
// import i18n from '@/i18n'

class RootStore {
  private duplex: PopupType
  private api: API
  account: Account
  history: History
  wallet: Wallet
  transaction: Transaction
  layout: Layout
  label: Label

  constructor() {
    this.duplex = new Popup()
    this.api = new API(this.duplex)
    this.account = new Account(this.api)
    this.history = new History(this.api)
    this.wallet = new Wallet(this.api)
    this.transaction = new Transaction(this.api)
    this.layout = new Layout()
    this.label = new Label()
  }

  // getLang = () => {

  // }
}

export default RootStore
