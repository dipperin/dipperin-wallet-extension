import { ApiType } from '@/api'

class Dapp {
  private _api: ApiType

  constructor(api: ApiType) {
    this._api = api
  }

  getSignMessage = () => {
    return this._api.getSignMessage()
  }

  confirmSignMessage = () => {
    this._api.confirmSignMessage()
  }
}

export default Dapp
