import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
// import RootStore from '../../stores/root'

import Modal from './index'
// import Label from '../../stores/label'

describe('Modal', () => {
  // const rootStore = new RootStore()
  // const label = new Label()
  let component: ShallowWrapper
  // let instance: Button

  beforeEach(() => {
    component = shallow(<Modal />)
    // instance = component.instance() as AlertPop
  })
  it('render', () => {
    // rootStore.pop.alert('Info')
    expect(component.exists()).toBe(true)
  })
})
