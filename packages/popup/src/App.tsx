import { Provider } from 'mobx-react'
import React from 'react'

import './App.css'

import { Popup, PopupType } from '@dipperin/lib/duplex'

import Routes from './routes'
import RootStore from './stores/root'

const rootStore = new RootStore()

class App extends React.Component {
  duplex: PopupType

  constructor(props) {
    super(props)
    this.duplex = new Popup()

    this.duplex.send('getRoot', {})!.then(res => console.log('getRoot', res))
  }

  public render() {
    return (
      <Provider {...rootStore}>
        <Routes />
      </Provider>
    )
  }
}

export default App
