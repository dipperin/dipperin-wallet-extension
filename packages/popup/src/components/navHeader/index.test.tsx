import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import '@/tests/mock/mockChrome'
import { mockApi } from '../../tests/mock/api'
import History from '@/stores/history'
import Account from '@/stores/account'
import Label from '@/stores/label'
import NavHeader from './index'
// import Label from '../../stores/label'

describe('NavHeader', () => {
  // const rootStore = new RootStore()
  const history = new History(mockApi)
  const account = new Account(mockApi)
  const label = new Label()
  let component: ShallowWrapper
  let instance: NavHeader
  account.updateAccountStore = jest.fn()

  beforeEach(() => {
    component = shallow(<NavHeader history={history} account={account} label={label} />).dive()
    instance = component.instance() as NavHeader
  })
  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('turnToAccounts', () => {
    history.historyPush = jest.fn()
    instance.turnToAccounts()
    expect(history.historyPush).toHaveBeenCalled()
  })

  it('turnToCreateAccount', () => {
    history.historyPush = jest.fn()
    instance.turnToCreateAccount()
    expect(history.historyPush).toHaveBeenCalled()
  })

  it('turnToSetting', () => {
    history.historyPush = jest.fn()
    instance.turnToSetting()
    expect(history.historyPush).toHaveBeenCalled()
  })

  it('handleShowModal', () => {
    const e = {
      nativeEvent: {
        stopImmediatePropagation: jest.fn()
      }
    }
    instance.handleShowModal(e)
    expect(instance.showModal).toBe(true)
  })

  it('handleHideModal', () => {
    instance.handleHideModal()
    expect(instance.showModal).toBe(false)
  })

  it('stopPropagation', () => {
    const e = {
      nativeEvent: {
        stopImmediatePropagation: jest.fn()
      }
    }
    instance.stopPropagation(e)
    expect(e.nativeEvent.stopImmediatePropagation).toHaveBeenCalled()
  })

  it('changeActiveAccount', () => {
    account.changeCurrentAccount = jest.fn()
    instance.changeActiveAccount('1')()
    expect(account.changeCurrentAccount).toHaveBeenCalled()
  })
})
