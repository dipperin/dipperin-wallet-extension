import React from 'react'
import { Fragment } from 'react'
import { observer, inject } from 'mobx-react'

import LayoutStores from '@/stores/layout'
import Loading from '@/components/loading'

interface LayoutProps {
  layout?: LayoutStores
}

@inject('layout')
@observer
class Layout extends React.Component<LayoutProps> {
  render() {
    const showLoading = this.props.layout!.loadingHandler.show
    return (
      <Fragment>
        {this.props.children}
        <Loading show={showLoading} />
      </Fragment>
    )
  }
}

export default Layout
