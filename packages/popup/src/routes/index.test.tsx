import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import '@/tests/mock/mockChrome'

import History from '@/stores/history'
// import Wallet from '@/stores/wallet'
// import Account from '@/stores/account'
// import Transaction from '@/stores/transaction'
import { mockApi } from '@/tests/mock/api'
// import Label from '@/stores/label'

import { COMPONENT_DIC } from './constant'

import Routes from './index'

import Login from '@/containers/login'

describe('Routes', () => {
  const history = new History(mockApi)
  // const wallet = new Wallet(mockApi)
  // const account = new Account(mockApi)
  // const transaction = new Transaction(mockApi)
  // const label = new Label()
  let component: ShallowWrapper
  // let instance: Routes

  beforeEach(() => {
    component = shallow(<Routes history={history} />).dive()
    // instance = component.instance() as Routes
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('COMPONENT_DIC', () => {
    expect(COMPONENT_DIC['0']).toEqual(Login)
  })
})
