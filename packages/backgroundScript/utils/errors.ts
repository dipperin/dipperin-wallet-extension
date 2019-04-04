export class InvalidWalletError extends Error {
  public name = 'InvalidWalletError'

  constructor() {
    super()
    Object.setPrototypeOf(this, InvalidWalletError.prototype)
    this.message = `The wallet is invalid!`
  }
}

export class NoEnoughBalanceError extends Error {
  public name = 'NoEnoughBalance'

  constructor() {
    super()
    Object.setPrototypeOf(this, NoEnoughBalanceError.prototype)
    this.message = 'insufficient balance'
  }
}

export default {
  InvalidWalletError,
  NoEnoughBalanceError
}
