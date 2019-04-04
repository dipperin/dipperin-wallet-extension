import { observable, computed, action } from 'mobx'

import API from '@/api'

class History {
  private _api: API

  @observable
  private _appState: number = 0

  constructor(api: API) {
    this._api = api
    this.getCurrentState()
    this.onAppState()
  }

  @action
  private getCurrentState = () => {
    this._api.getCurrentPage()!.then((res: number) => {
      this.changeAppState(res)
    })
  }

  historyPush = (appState: number) => {
    this._api.setAppState(appState)
  }

  @action
  private onAppState = () => {
    this._api.onAppState(res => {
      this._appState = res
    })
  }

  @action
  private changeAppState = (appState: number) => {
    this._appState = appState
  }

  @computed
  get appState() {
    return this._appState
  }
}

export default History
