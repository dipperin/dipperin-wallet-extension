import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import '@/tests/mock/mockChrome'
import History from '../../stores/history'
import { mockApi } from '../../tests/mock/api'
import Label from '../../stores/label'

import Login from './index'

describe('Login', () => {
  const history = new History(mockApi)
  const label = new Label()
  let component: ShallowWrapper

  beforeEach(() => {
    component = shallow(<Login history={history} label={label} />)
  })
  it('render', () => {
    expect(component.exists()).toBe(true)
  })
})
