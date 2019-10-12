import React, { Component } from 'react'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'

@observer
class DetailInfo extends Component {
  @observable
  ifRename: boolean = false

  @action
  setIfRename = (flag: boolean) => {
    this.ifRename = flag
  }

  render() {
    return <div>lll</div>
  }
}

export default DetailInfo
