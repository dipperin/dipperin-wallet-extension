import { EncryptResult } from '@dipperin/dipperin.js'

class Wallet {
  private _encryptSeed: EncryptResult
  private _unlockErrTimes: number
  private _lockTime: string
  constructor(walletObj: WalletObj) {
    this._encryptSeed = walletObj.encryptSeed
    this._unlockErrTimes = walletObj.unlockErrTimes
    this._lockTime = walletObj.lockTime
  }

  get encryptSeed(): EncryptResult {
    return this._encryptSeed
  }

  set encryptSeed(seed: EncryptResult) {
    this._encryptSeed = seed
  }

  get unlockErrTimes(): number {
    return this._unlockErrTimes
  }

  set unlockErrTimes(times: number) {
    this._unlockErrTimes = times
  }

  get lockTime(): string {
    return this._lockTime
  }

  set lockTime(time: string) {
    this.lockTime = time
  }

  toJS(): WalletObj {
    return {
      encryptSeed: this._encryptSeed,
      unlockErrTimes: this._unlockErrTimes,
      lockTime: this._lockTime
    }
  }
}

export default Wallet

export interface WalletObj {
  encryptSeed: EncryptResult
  unlockErrTimes: number
  lockTime: string
}

export interface ImportParams {
  password: string
  mnemonic: string
}
