import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import '@/tests/mock/mockChrome'
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
  let instance: DappSend

  beforeEach(() => {
    component = shallow(<DappSend account={account} transaction={transaction} history={history} label={label} />).dive()
    instance = component.instance() as DappSend
  })
  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('fee', () => {
    expect(instance.fee).toBe(100000000)
  })

  it('verifyGasPrince', () => {
    expect(instance.verifyGasPrince).toBe(true)
  })

  it('adjustWindow', () => {
    expect(instance.adjustWindow).not.toThrow()
  })

  it('setAutoCloseWindow', async () => {
    jest.useFakeTimers()
    const spyonToQuit = jest.spyOn(instance, 'setAutoCloseWindow')
    instance.setAutoCloseWindow()
    jest.runAllTicks()
    expect(spyonToQuit).toHaveBeenCalled()
  })

  it('getTransactionInfo', async () => {
    transaction.getAppTx = jest.fn(async () => {
      return { appName: 'nodebb', to: '0x001', value: '100', extraData: '00' }
    })
    await instance.getTransactionInfo()
    expect(instance.appName).toBe('nodebb')
  })

  it('turnToAccount', () => {
    history.historyPush = jest.fn()
    instance.turnToAccounnts()
    expect(history.historyPush).toHaveBeenCalled()
  })

  it('turnToSettings', () => {
    history.historyPush = jest.fn()
    instance.turnToSettings()
    expect(history.historyPush).toHaveBeenCalled()
  })

  it('toQuit', () => {
    expect(instance.toQuit).not.toThrow()
  })

  it('handleAddress', () => {
    const e = {
      target: {
        value: 'aaa'
      }
    }
    instance.handleAddress(e)
    expect(instance.sendToAddress).toBe('aaa')
  })

  it('handleAmount', () => {
    const e = {
      target: {
        value: '10'
      }
    }
    instance.handleAmount(e)
    expect(instance.sendAmount).toBe('10')
  })

  it('handleAmount err', () => {
    const e = {
      target: {
        value: 'a'
      }
    }
    instance.handleAmount(e)
    expect(instance.sendAmount).toBe('100')
  })

  it('handleGasPrice', () => {
    const e = ({
      target: {
        value: '10'
      }
    } as any) as React.ChangeEvent<HTMLInputElement>
    instance.handleGasPrice(e)
    expect(instance.gasPrice).toBe('10')
  })

  it('updateGasPrice', () => {
    const e = ({
      target: {
        value: ''
      }
    } as any) as React.ChangeEvent<HTMLInputElement>
    instance.handleGasPrice(e)
    instance.updateGasPrice()
    expect(instance.gasPrice).toBe('1')
  })

  it('setGas', () => {
    instance.setGas('1000000')
    expect(instance.gas).toBe('1000000')
  })

  it('genTx', () => {
    expect(instance.genTx('0x001', '1', '1')).toEqual({
      address: '0x001',
      amount: '1',
      memo: '00',
      gas: '100000000',
      gasPrice: '1'
    })
  })

  it('getEstimateGas', async () => {
    const e = {
      target: {
        value: '0x000001'
      }
    }
    instance.handleAddress(e)
    const e2 = {
      target: {
        value: '1'
      }
    }
    instance.handleAmount(e2)
    transaction.getEstimateGas = jest.fn(async () => '1000000')
    await instance.getEstimateGas()
    expect(instance.gas).toBe('1000000')
  })

  it('translateErrorInfo', () => {
    const res = instance.translateErrorInfo('ResponseError: Returned error: "tx nonce is invalid"')
    expect(res).toBe('Your action is too frequent, please try 10s later.')
  })

  it('sendTransfer', async () => {
    const spyOnShowMsg = jest.spyOn(instance, 'showMsg')
    transaction.verifyTx = jest.fn(() => {
      return { success: true }
    })
    transaction.sendTxForApp = jest.fn(async () => {
      return {}
    })
    await instance.sendTransfer()
    expect(spyOnShowMsg.mock.calls[0][0]).toBe('Send Success, please wait for synchronization!')
  })

  it('sendTransfer send err', async () => {
    const spyOnShowMsg = jest.spyOn(instance, 'showMsg')
    transaction.verifyTx = jest.fn(() => {
      return { success: true }
    })
    transaction.sendTxForApp = jest.fn().mockRejectedValue('error')
    await instance.sendTransfer()
    expect(spyOnShowMsg.mock.calls[0][0]).toBe(instance.translateErrorInfo('error'))
  })

  it('sendTransfer tx err', async () => {
    const spyOnShowMsg = jest.spyOn(instance, 'showMsg')
    transaction.verifyTx = jest.fn(() => {
      return { success: false, info: 'tx error' }
    })
    transaction.sendTxForApp = jest.fn().mockRejectedValue('error')
    await instance.sendTransfer()
    expect(spyOnShowMsg.mock.calls[0][0]).toBe('tx error')
  })

  it('closeWindow', () => {
    window.open = jest.fn()
    window.close = jest.fn()
    instance.closeWindow()
    expect(window.close).toHaveBeenCalled()
  })

  it('showMsg', () => {
    jest.useFakeTimers()
    instance.showMsg('msg')
    expect(instance.modalHandler.modalMsg).toBe('msg')
    jest.runAllTimers()
    expect(instance.modalHandler.modalMsg).toBe('')
  })

  it('formatExtraData', async () => {
    transaction.getAppTx = jest.fn(async () => {
      return { appName: 'nodebb', to: '0x001', value: '100', extraData: '[1,2,3]' }
    })
    await instance.getTransactionInfo()
    const res = instance.formatExtraData()
    expect(res).toBe('1-2-3')
  })
})
