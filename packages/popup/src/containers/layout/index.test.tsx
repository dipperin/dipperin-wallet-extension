import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import LayoutStore from '../../stores/layout'

import Layout from './index'

describe('Layout', () => {
  const layout = new LayoutStore()
  let component: ShallowWrapper

  beforeEach(() => {
    component = shallow(<Layout layout={layout} />)
  })
  it('render', () => {
    expect(component.exists()).toBe(true)
  })
})
