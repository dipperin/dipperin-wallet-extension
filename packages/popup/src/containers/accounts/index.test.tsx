import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import '@/tests/mock/mockChrome'
import History from '../../stores/history'
import Account from '../../stores/account'
import { mockApi } from '../../tests/mock/api'
import Label from '../../stores/label'

import Accounts from './index'

describe('Accounts', () => {
  const history = new History(mockApi)
  const account = new Account(mockApi)
  const label = new Label()
  let component: ShallowWrapper

  beforeEach(() => {
    component = shallow(<Accounts account={account} history={history} label={label} />)
  })
  it('render', () => {
    expect(component.exists()).toBe(true)
  })
})
