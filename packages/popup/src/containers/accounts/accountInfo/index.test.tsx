import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import '@/tests/mock/mockChrome'
// import History from '@/stores/history'
import Account from '@/stores/account'
import { mockApi } from '@/tests/mock/api'
// import MockLabel from '@/tests/mock/label'
import Label from '@/stores/label'

import AccountInfo from './index'

describe('AccountInfo', () => {
  // const history = new History(mockApi)
  const account = new Account(mockApi)
  const label = new Label()
  let component: ShallowWrapper
  let instance: AccountInfo

  beforeEach(() => {
    component = shallow(<AccountInfo account={account} label={label} />).dive()
    instance = component.instance() as AccountInfo
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('openInputAccount', () => {
    instance.openInputAccount()
    expect(instance.inputAccount).toBe(true)
  })

  it('closeInputAccount', () => {
    instance.closeInputAccount()
    expect(instance.inputAccount).toBe(false)
  })

  it('updatename', () => {
    instance.updateName('new')
    expect(instance.accountName).toBe('new')
  })

  it('handleChangeName', () => {
    const mockEvent = {
      target: {
        value: 'value'
      }
    }
    instance.handleChangeName(mockEvent)
    expect(instance.accountName).toBe('value')
  })

  it('isCN', () => {
    expect(instance.isCN('中')).toBe(true)
  })

  it('verifyAccountName', () => {
    const mockEvent = {
      target: {
        value: 'value'
      }
    }
    instance.handleChangeName(mockEvent)
    expect(instance.verifyAccountName).toBe(true)
  })

  it('refinput', () => {
    const mockInstance = ({ focus: jest.fn() } as any) as HTMLInputElement
    instance.refinput(mockInstance)
    expect(instance.nameInput.focus).toHaveBeenCalled()
  })

  it('changeAccountName', async () => {
    const mockEvent = {
      target: {
        value: 'value'
      }
    }
    mockApi.getAccounts = jest.fn(async () => {
      return [{ name: 'name', address: '0x00', id: '1', path: '/1', balance: '0', lockBalance: '0' }]
    })
    await account.getAccountInfo()
    await account.changeCurrentAccount('1')
    instance.handleChangeName(mockEvent)
    account.updateAccountName = jest.fn(async () => {
      return { success: true }
    })
    expect(instance.changeAccountName).not.toThrow()
  })

  it('copyAddress', async () => {
    mockApi.getAccounts = jest.fn(async () => {
      return [{ name: 'name', address: '0x00', id: '1', path: '/1', balance: '0', lockBalance: '0' }]
    })
    await account.getAccountInfo()
    // await account.changeCurrentAccount('1')
    document.execCommand = jest.fn(() => true)
    expect(instance.copyAddress).not.toThrow()
  })

  it('handleKeyDown', () => {
    const e = {
      keyCode: 13
    }
    const mockEvent = {
      target: {
        value: 'value'
      }
    }
    instance.handleChangeName(mockEvent)
    const spyOnChangeAccountName = jest.spyOn(instance, 'changeAccountName')
    instance.handleKeyDown(e)
    expect(spyOnChangeAccountName).toHaveBeenCalled()
  })

  it('formatAddress', () => {
    const address = '0x00008AD27452ACD62e646088A76D098156B2358357ff'
    expect(instance.formatAddress(address)).toBe('0x00008AD27452ACD...D098156B2358357ff')
  })

  it('toggleDisplayTooltip', () => {
    instance.toggleDisplayTooltip()
    expect(instance.displayTooltip).toBe(true)
  })

  it('showTooltip', () => {
    instance.showTooltip()
    expect(instance.displayTooltip).toBe(true)
  })

  it('formatNumber', () => {
    expect(instance.formatNumber('10.99', 1)).toBe('10.9')
  })
})
