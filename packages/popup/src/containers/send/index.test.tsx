import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import '@/tests/mock/mockChrome'
import History from '@/stores/history'
import Account from '@/stores/account'
import Transaction from '@/stores/transaction'
import Layout from '@/stores/layout'
import { mockApi } from '../../tests/mock/api'
import Label from '../../stores/label'

import Send from './index'

describe('Send', () => {
  const history = new History(mockApi)
  const account = new Account(mockApi)
  const transaction = new Transaction(mockApi)
  const label = new Label()
  const layout = new Layout()
  let component: ShallowWrapper
  let instance: Send

  beforeEach(() => {
    component = shallow(
      <Send account={account} transaction={transaction} history={history} label={label} layout={layout} />
    ).dive()
    instance = component.instance() as Send
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('fee', () => {
    expect(instance.fee).toBe(21000)
  })

  it('verifyGasPrince', () => {
    expect(instance.verifyGasPrince).toBe(true)
  })

  it('setGas', () => {
    instance.setGas('1000000')
    expect(instance.gas).toBe('1000000')
  })

  it('showMsg', () => {
    jest.useFakeTimers()
    instance.showMsg('msg')
    expect(instance.modalHandler.modalMsg).toBe('msg')
    jest.runAllTimers()
    expect(instance.modalHandler.modalMsg).toBe('')
  })

  it('getEstimateGas', async () => {
    const e = ({
      target: {
        value: '0x000001'
      }
    } as any) as React.ChangeEvent<HTMLInputElement>
    instance.handleAddress(e)
    const e2 = ({
      target: {
        value: '1'
      }
    } as any) as React.ChangeEvent<HTMLInputElement>
    instance.handleAmount(e2)
    transaction.getEstimateGas = jest.fn(async () => '1000000')
    await instance.getEstimateGas()
    expect(instance.gas).toBe('1000000')
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

  it('handleAddress', () => {
    const e = ({
      target: {
        value: '0x00008AD27452ACD62e646088A76D098156B2358357ff'
      }
    } as any) as React.ChangeEvent<HTMLInputElement>
    instance.handleAddress(e)
    expect(instance.sendToAddress).toBe('0x00008AD27452ACD62e646088A76D098156B2358357ff')
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

  it('handleGasPrice', () => {
    const e = ({
      target: {
        value: '10'
      }
    } as any) as React.ChangeEvent<HTMLInputElement>
    instance.handleGasPrice(e)
    expect(instance.gasPrice).toBe('10')
  })

  it('genTx', () => {
    expect(instance.genTx('0x001', '1', '1')).toEqual({
      address: '0x001',
      amount: '1',
      memo: '',
      gas: '21000',
      gasPrice: '1'
    })
  })

  it('translateErrorInfo', () => {
    const res = instance.translateErrorInfo('ResponseError: Returned error: "tx nonce is invalid"')
    expect(res).toBe('Your action is too frequent, please try 10s later.')
  })

  it('sendTransfer', async () => {
    jest.useFakeTimers()
    transaction.verifyTx = jest.fn(() => {
      return { success: true }
    })
    layout.handleCloseLoading = jest.fn()
    transaction.sendTxForApp = jest.fn(async () => {
      return {}
    })
    await instance.sendTransfer()
    jest.runAllTimers()
    expect(layout.handleCloseLoading).toHaveBeenCalled()
  })

  it('sendTransfer send err', async () => {
    transaction.verifyTx = jest.fn(() => {
      return { success: true }
    })
    layout.handleCloseLoading = jest.fn()
    transaction.sendTxForApp = jest.fn().mockRejectedValue('error')
    await instance.sendTransfer()
    expect(layout.handleCloseLoading).toHaveBeenCalled()
  })

  it('sendTransfer tx err', async () => {
    jest.useFakeTimers()
    transaction.verifyTx = jest.fn(() => {
      return { success: false, info: 'tx error' }
    })
    layout.handleCloseLoading = jest.fn()
    transaction.sendTxForApp = jest.fn().mockRejectedValue('error')
    await instance.sendTransfer()
    jest.runAllTimers()
    expect(layout.handleCloseLoading).toHaveBeenCalled()
  })

  it('handleAddGasPrice', () => {
    instance.handleAddGasPrice()
    expect(instance.gasPrice).toBe('2')
  })

  it('handleSubGasPrice', () => {
    instance.handleAddGasPrice()
    instance.handleSubGasPrice()
    expect(instance.gasPrice).toBe('1')
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
})
