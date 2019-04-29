import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import History from '../../stores/history'
import Wallet from '../../stores/wallet'
import Account from '../../stores/account'
import { mockApi } from '../../tests/mock/api'
import Label from '../../stores/label'

import SetPassword from './index'

describe('SetPassword', () => {
  const history = new History(mockApi)
  const wallet = new Wallet(mockApi)
  const account = new Account(mockApi)
  const label = new Label()
  let component: ShallowWrapper

  beforeEach(() => {
    component = shallow(<SetPassword account={account} wallet={wallet} history={history} label={label} />)
  })
  it('render', () => {
    expect(component.exists()).toBe(true)
  })
})
