import BIP39 from 'bip39'
import { Accounts, AccountObject } from '@dipperin/dipperin.js'
import WalletModel, { WalletObj } from '@dipperin/lib/models/wallet'
import { getWallet, setWallet } from '../storage'
import { DEFAULT_ERR_TIMES, DEFAULT_LOCK_TIME } from '@dipperin/lib/constants'
class Wallet {
  private _wallet?: WalletModel
  private _hdAccount?: AccountObject
  private _mnemonic?: string

  get mnemonic(): string | undefined {
    return this._mnemonic
  }

  get isHaveWallet(): boolean {
    return !!this._wallet
  }

  get isUnlock(): boolean {
    return !!this._hdAccount
  }

  get hdAccount(): AccountObject {
    return this._hdAccount
  }

  destroyMnemonic?: () => Error | void
  /**
   * load wallet from cache
   */
  async load(): Promise<boolean> {
    const walletObj = await getWallet()
    if (!walletObj) {
      return false
    }
    try {
      this._wallet = new WalletModel(walletObj)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  create(password: string, mnemonic?: string): Error | void {
    try {
      if (!mnemonic) {
        // If not input a mnemonic, generate a new mnemonic and save
        this.destroyMnemonic = this.createDestroyMnemonic(password)
      } else {
        this.initWallet(password, mnemonic)
      }
    } catch (err) {
      return err
    }
  }

  unlockWallet(password: string): boolean {
    const account = this.getHdAccount(password)
    if (account) {
      console.log('unlock')
      this._hdAccount = account
      return true
    }
    return false
  }

  lockWallet() {
    this._hdAccount = undefined
  }

  clear() {
    this._wallet = undefined
    this._hdAccount = undefined
    this.destroyMnemonic = undefined
  }

  /**
   * Init the new wallet
   * @param password
   * @param mnemonic
   */
  private initWallet(password: string, mnemonic: string): void {
    // init wallet id
    // Try to parse mnemonic to seed, if fail, return error
    const seed = `0x${BIP39.mnemonicToSeedHex(mnemonic)}`
    const hdAccount = Accounts.create(seed)
    // save encrypt seed, an then clear password and mnemonic
    const encryptSeed = hdAccount.encrypt(password)
    const walletObj: WalletObj = {
      encryptSeed,
      unlockErrTimes: DEFAULT_ERR_TIMES,
      lockTime: DEFAULT_LOCK_TIME
    }
    this._wallet = new WalletModel(walletObj)
    this._hdAccount = hdAccount
    // save wallet to storage
    setWallet(this._wallet.toJS())
  }

  private getHdAccount(password: string): undefined | AccountObject {
    if (!this._wallet || !this._wallet.encryptSeed) {
      return undefined
    }
    try {
      const account = Accounts.decrypt(this._wallet.encryptSeed, password)
      // reset error times
      this._wallet.unlockErrTimes = DEFAULT_ERR_TIMES
      return account
    } catch (_) {
      // FIXME: error times should have init value 0
      const preErrTimes = this._wallet.unlockErrTimes
      let errTimes = preErrTimes ? preErrTimes : DEFAULT_ERR_TIMES
      this._wallet.unlockErrTimes = ++errTimes
      return undefined
    }
  }

  private createDestroyMnemonic(password: string): () => void {
    const mnemonic = BIP39.generateMnemonic()
    this._mnemonic = mnemonic
    return (): Error | void => {
      // Destroy mnemonic and init the wallet
      try {
        this.initWallet(password, mnemonic)
      } catch (err) {
        return err
      }
      this._mnemonic = ''
    }
  }
}

export default Wallet
