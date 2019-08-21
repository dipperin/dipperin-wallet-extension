import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
// import RootStore from '../../stores/root'

import Loading from './index'
// import Label from '../../stores/label'

describe('Loading', () => {
  // const rootStore = new RootStore()
  // const label = new Label()
  let component: ShallowWrapper
  // let instance: Button

  beforeEach(() => {
    component = shallow(<Loading show={true} />)
    // instance = component.instance() as AlertPop
  })
  it('render', () => {
    // rootStore.pop.alert('Info')
    expect(component.exists()).toBe(true)
  })
})
