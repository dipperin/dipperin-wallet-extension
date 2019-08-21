import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import '@/tests/mock/mockChrome'
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
  let instance: SetPassword

  beforeEach(() => {
    component = shallow(<SetPassword wallet={wallet} history={history} label={label} />).dive()
    instance = component.instance() as SetPassword
  })
  it('render', () => {
    expect(component.exists()).toBe(true)
  })
  it('toQuit', () => {
    history.historyPush = jest.fn()
    instance.toQuit()
    expect(history.historyPush).toHaveBeenCalled()
  })
  it('toBackup', () => {
    history.historyPush = jest.fn()
    instance.toBackup()
    expect(history.historyPush).toHaveBeenCalled()
  })
  it('handlePassword', () => {
    const e = ({
      target: {
        value: '12345678'
      }
    } as any) as React.ChangeEvent<{ value: string }>
    instance.handlePassword(e)
    expect(instance.input.password).toBe('12345678')
  })
  it('handleRepeatPassword', () => {
    const e = ({
      target: {
        value: '12345678'
      }
    } as any) as React.ChangeEvent<{ value: string }>
    instance.handleRepeatPassword(e)
    expect(instance.input.repeatPassword).toBe('12345678')
  })
  it('verifyInput', () => {
    const e = ({
      target: {
        value: '12345678'
      }
    } as any) as React.ChangeEvent<{ value: string }>
    instance.handlePassword(e)
    instance.handleRepeatPassword(e)
    expect(instance.verifyInput).toBe(true)
  })
  it('handleonKeyDown', () => {
    const e = ({
      target: {
        value: '12345678'
      }
    } as any) as React.ChangeEvent<{ value: string }>
    instance.handlePassword(e)
    instance.handleRepeatPassword(e)
    const e2 = ({
      keyCode: 13
    } as any) as React.KeyboardEvent
    const spyOnhandleToBackup = jest.spyOn(instance, 'handleToBackup')
    instance.handleonKeyDown(e2)
    expect(spyOnhandleToBackup).toHaveBeenCalled()
  })

  it('handlePswBlur', async () => {
    jest.useFakeTimers()
    const e = ({
      target: {
        value: '1234567'
      }
    } as any) as React.ChangeEvent<{ value: string }>
    instance.handlePassword(e)
    instance.handlePswBlur()
    expect(instance.msgs.psw[1]).toBe(true)
    jest.runAllTimers()
    expect(instance.msgs.psw[1]).toBe(false)
  })

  it('handleRpswBlur', async () => {
    jest.useFakeTimers()
    const e = ({
      target: {
        value: '12345678'
      }
    } as any) as React.ChangeEvent<{ value: string }>
    instance.handlePassword(e)
    instance.handleRpswBlur()
    expect(instance.msgs.rpsw[1]).toBe(true)
    jest.runAllTimers()
    expect(instance.msgs.rpsw[1]).toBe(false)
  })
})
