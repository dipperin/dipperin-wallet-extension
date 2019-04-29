import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import History from '../../stores/history'
import Wallet from '../../stores/wallet'
import { mockApi } from '../../tests/mock/api'
import Label from '../../stores/label'

import SetPassword from './index'

describe('SetPassword', () => {
  const history = new History(mockApi)
  const wallet = new Wallet(mockApi)
  const label = new Label()
  let component: ShallowWrapper

  beforeEach(() => {
    component = shallow(<SetPassword wallet={wallet} history={history} label={label} />)
  })
  it('render', () => {
    expect(component.exists()).toBe(true)
  })
})
