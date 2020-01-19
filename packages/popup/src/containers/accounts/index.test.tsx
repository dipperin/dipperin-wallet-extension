import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import '@/tests/mock/mockChrome'
import History from '../../stores/history'
import Account from '../../stores/account'
import Layout from '../../stores/layout'
import { mockApi } from '../../tests/mock/api'
import Label from '../../stores/label'

import Accounts from './index'

describe('Accounts', () => {
  const history = new History(mockApi)
  const account = new Account(mockApi)
  const label = new Label()
  const layout = new Layout()
  let component: ShallowWrapper

  beforeEach(() => {
    component = shallow(<Accounts account={account} layout={layout} history={history} label={label} />)
  })
  it('render', () => {
    expect(component.exists()).toBe(true)
  })
})
