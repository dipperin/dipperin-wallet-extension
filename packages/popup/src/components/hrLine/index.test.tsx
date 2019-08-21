import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
// import RootStore from '../../stores/root'

import HrLine from './index'
// import Label from '../../stores/label'

describe('HrLine', () => {
  // const rootStore = new RootStore()
  // const label = new Label()
  let component: ShallowWrapper
  // let instance: Button

  beforeEach(() => {
    component = shallow(<HrLine />)
    // instance = component.instance() as AlertPop
  })
  it('render', () => {
    // rootStore.pop.alert('Info')
    expect(component.exists()).toBe(true)
  })
})
