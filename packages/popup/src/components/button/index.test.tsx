import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
// import RootStore from '../../stores/root'

import Button from './index'
// import Label from '../../stores/label'

describe('Button', () => {
  // const rootStore = new RootStore()
  // const label = new Label()
  let component: ShallowWrapper
  // let instance: Button

  beforeEach(() => {
    const param = {
      classes: ['btn']
    }
    // tslint:disable-next-line:no-empty
    component = shallow(<Button params={param} onClick={() => {}} />)
    // instance = component.instance() as AlertPop
  })
  it('render', () => {
    // rootStore.pop.alert('Info')
    expect(component.exists()).toBe(true)
  })
})
