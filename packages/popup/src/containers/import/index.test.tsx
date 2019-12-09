import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import '@/tests/mock/mockChrome'
import History from '../../stores/history'
import Wallet from '../../stores/wallet'
import Layout from '../../stores/layout'
import { mockApi } from '../../tests/mock/api'
import Label from '../../stores/label'

import Import from './index'

describe('Import', () => {
  const history = new History(mockApi)
  const wallet = new Wallet(mockApi)
  const label = new Label()
  const layout = new Layout()
  let component: ShallowWrapper
  let instance: Import

  beforeEach(() => {
    component = shallow(<Import wallet={wallet} history={history} label={label} layout={layout} />).dive()
    instance = component.instance() as Import
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
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

  it('verifyInput false', () => {
    const e1 = ({
      target: {
        value: '12345678'
      }
    } as any) as React.ChangeEvent<{ value: string }>
    instance.handlePassword(e1)
    const e2 = ({
      target: {
        value: '12345678'
      }
    } as any) as React.ChangeEvent<{ value: string }>
    instance.handleRepeatPassword(e2)
    expect(instance.verifyInput).toBe(false)
  })

  it('verifyInput true', () => {
    const e1 = ({
      target: {
        value: '12345678'
      }
    } as any) as React.ChangeEvent<{ value: string }>
    instance.handlePassword(e1)
    instance.handleRepeatPassword(e1)
    instance.handleMnemonic(e1)
    expect(instance.verifyInput).toBe(true)
  })

  it('handleMnemonic', () => {
    const e1 = ({
      target: {
        value: '12345678'
      }
    } as any) as React.ChangeEvent<{ value: string }>
    instance.handleMnemonic(e1)
    expect(instance.mnemonic).toBe('12345678')
  })

  it('handleCancel', () => {
    history.historyPush = jest.fn()
    instance.handleCancel()
    expect(history.historyPush).toHaveBeenCalled()
  })

  it('handleCancel', () => {
    history.historyPush = jest.fn()
    instance.toAccount()
    expect(history.historyPush).toHaveBeenCalled()
  })

  it('importWallet', async () => {
    layout.handleOpenLoading = jest.fn()
    wallet.importWallet = jest.fn(async () => {
      return { success: true }
    })
    layout.handleCloseLoading = jest.fn()
    await instance.importWallet()
    expect(layout.handleCloseLoading).toHaveBeenCalled()
  })

  it('handleKeyDown', () => {
    const e = ({
      keyCode: 13
    } as any) as React.KeyboardEvent
    const e1 = ({
      target: {
        value: '12345678'
      }
    } as any) as React.ChangeEvent<{ value: string }>
    const spyOnHandleConfirm = jest.spyOn(instance, 'handleConfirm')
    instance.handlePassword(e1)
    instance.handleRepeatPassword(e1)
    instance.handleMnemonic(e1)
    instance.handleonKeyDown(e)
    expect(spyOnHandleConfirm).toHaveBeenCalled()
  })

  it('handlePswBlur', async () => {
    jest.useFakeTimers()
    const e1 = {
      target: {
        value: '1234567'
      }
    } as any
    instance.handlePassword(e1)
    instance.handlePswBlur(e1)
    expect(instance.msgs.psw[1]).toBe(true)
    jest.runAllTimers()
    expect(instance.msgs.psw[1]).toBe(false)
  })

  it('handleRpswBlur', async () => {
    jest.useFakeTimers()
    const e1 = ({
      target: {
        value: '1234567'
      }
    } as any) as React.ChangeEvent<{ value: string }>
    instance.handlePassword(e1)
    const e2 = {
      target: {
        value: '12345678'
      }
    } as any
    instance.handleRepeatPassword(e2)
    instance.handlePswBlur(e2)
    expect(instance.msgs.psw[1]).toBe(true)
    jest.runAllTimers()
    expect(instance.msgs.psw[1]).toBe(false)
  })
})
