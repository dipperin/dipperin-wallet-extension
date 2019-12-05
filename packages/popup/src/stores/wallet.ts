import API from '@/api'
import BIP39 from 'bip39'
// import { observable, computed } from 'mobx'

class Wallet {
  private _api: API

  // @observable
  // private _mnemonic: string

  constructor(api: API) {
    this._api = api
  }

  // @computed
  // get mnemonic() {
  //   return this._mnemonic
  // }

  setPassword = (password: string) => {
    return this._api.setPassword(password)
  }

  getMnenmonic = () => {
    return this._api.getMnemonic()
  }

  createWallet = () => {
    return this._api.createWallet()
  }

  importWallet = (password: string, mnemonic: string) => {
    if (!BIP39.validateMnemonic(mnemonic)) {
      throw new Error('invalid mnemonic')
    }
    return this._api.importWallet(password, mnemonic)
  }

  unlockWallet = (password: string) => {
    return this._api.unlockWallet(password)
  }

  resetWallet = () => {
    this._api.resetWallet()
  }

  confirmAuth = () => {
    return this._api.confirmAuth()
  }

  changeNet = (remoteNode: string) => {
    this._api.changeNet(remoteNode)
  }

  getCurrentNet = () => {
    return this._api.getCurrentNet()
  }

  getAppName = () => {
    return this._api.getAppName()
  }
}

export default Wallet
