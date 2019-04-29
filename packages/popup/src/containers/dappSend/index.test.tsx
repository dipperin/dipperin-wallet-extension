import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import History from '../../stores/history'
import Account from '../../stores/account'
import Transaction from '../../stores/transaction'
import { mockApi } from '../../tests/mock/api'
import Label from '../../stores/label'

import DappSend from './index'

describe('DappSend', () => {
  const history = new History(mockApi)
  const account = new Account(mockApi)
  const transaction = new Transaction(mockApi)
  const label = new Label()
  let component: ShallowWrapper

  beforeEach(() => {
    component = shallow(<DappSend account={account} transaction={transaction} history={history} label={label} />)
  })
  it('render', () => {
    expect(component.exists()).toBe(true)
  })
})
