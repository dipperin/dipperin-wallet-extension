import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import { mockApi } from '../../tests/mock/api'
import History from '@/stores/history'
import Account from '@/stores/account'
import Label from '@/stores/label'
import Modal from './index'
// import Label from '../../stores/label'

describe('Modal', () => {
  // const rootStore = new RootStore()
  const history = new History(mockApi)
  const account = new Account(mockApi)
  const label = new Label()
  // const label = new Label()
  let component: ShallowWrapper
  // let instance: Button

  beforeEach(() => {
    component = shallow(<Modal history={history} account={account} label={label} />)
    // instance = component.instance() as AlertPop
  })
  it('render', () => {
    // rootStore.pop.alert('Info')
    expect(component.exists()).toBe(true)
  })
})
