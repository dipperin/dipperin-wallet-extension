import React from 'react'
import { Fragment } from 'react'
import { observer, inject } from 'mobx-react'

import LayoutStores from '@/stores/layout'
import Loading from '@/components/loading'
import Modal from '@/components/modal'

interface LayoutProps {
  layout?: LayoutStores
}

@inject('layout')
@observer
class Layout extends React.Component<LayoutProps> {
  render() {
    const showLoading = this.props.layout!.loadingHandler.show
    const showModal = this.props.layout!.showModal
    const modalMsg = this.props.layout!.modalMessage
    return (
      <Fragment>
        {this.props.children}
        <Loading show={showLoading} />
        <Modal showModal={showModal}>{modalMsg}</Modal>
      </Fragment>
    )
  }
}

export default Layout
