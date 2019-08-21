import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import '@/tests/mock/mockChrome'
import History from '../../stores/history'
import Wallet from '../../stores/wallet'
import { mockApi } from '../../tests/mock/api'
import Label from '../../stores/label'

import Auth from './index'

describe('Auth', () => {
  const history = new History(mockApi)
  const wallet = new Wallet(mockApi)
  const label = new Label()
  let component: ShallowWrapper
  let instance: Auth
  window.resizeBy = jest.fn()

  beforeEach(() => {
    component = shallow(<Auth wallet={wallet} history={history} label={label} />).dive()
    instance = component.instance() as Auth
  })
  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('getAppName', async () => {
    wallet.getAppName = jest.fn(async () => {
      return 'new'
    })
    await instance.getAppName()
    expect(instance.appName).toBe('new')
  })

  it('autoCloseWindow', () => {
    jest.useFakeTimers()
    const spyOnToClose = jest.spyOn(instance, 'toClose')
    instance.autoCloseWindow()
    jest.runAllTimers()
    expect(spyOnToClose).toHaveBeenCalled()
  })

  it('toClose', () => {
    window.open = jest.fn()
    window.close = jest.fn()
    instance.toClose()
    expect(window.close).toHaveBeenCalled()
  })

  it('adjustWindow', () => {
    window.resizeBy = jest.fn()
    instance.adjustWindow()
    expect(window.resizeBy).toHaveBeenCalled()
  })

  it('agreeAuth', async () => {
    window.alert = jest.fn()
    wallet.confirmAuth = jest.fn()
    await instance.agreeAuth()
    expect(window.alert).toHaveBeenCalled()
  })
})
