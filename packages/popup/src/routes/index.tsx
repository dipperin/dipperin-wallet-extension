import React from 'react'
import { inject, observer } from 'mobx-react'

import History from '@/stores/history'
import Layout from '@/containers/layout'

import { COMPONENT_DIC } from './constant'

interface RoutesProps {
  history?: History
}

@inject('history')
@observer
class Routes extends React.Component<RoutesProps> {
  showPage = () => {
    const appState = this.props.history!.appState
    const Component = COMPONENT_DIC[appState]
    return <Component />
  }
  render() {
    return <Layout>{this.showPage()}</Layout>
  }
}

export default Routes
