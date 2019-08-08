import { mockApi } from '@/tests/mock/api'
import TransactionStore from './transaction'

describe('transaction Store', () => {
  // const mockApi = MockApi()
  let transaction: TransactionStore
  it('constructor', () => {
    mockApi.onUpdateStatus = jest.fn().mockImplementation(cb => {
      const txParam = {
        transactionHash: 'testHash',
        status: 'finished"'
      }
      cb(txParam)
    })
    expect(() => {
      transaction = new TransactionStore(mockApi)
    }).not.toThrow()
  })

  // it('getMinTransactionFee', async () => {
  //   mockApi.getMinTxFee = jest.fn().mockResolvedValue('0.00001')
  //   const sendParam = {
  //     address: '0x0000723c7780e40199937eE2207bC7008434b7C0eeFF',
  //     amount: '1',
  //     memo: 'xxx'
  //   }
  //   const res = await transaction.getMinTransactionFee(sendParam)
  //   expect(res).toBe('0.00001')
  // })

  it('sendTransaction', async () => {
    mockApi.sendTransaction = jest.fn().mockResolvedValue(true)
    const sendParam = {
      address: '0x0000723c7780e40199937eE2207bC7008434b7C0eeFF',
      amount: '1',
      memo: 'xxx',
      fee: '0.0001'
    }
    const res = await transaction.sendTransaction(sendParam)
    expect(res).toBe(true)
  })

  it('getAppTx', async () => {
    const appTx = {
      appName: 'Rich Bet',
      to: '0x0000723c7780e40199937eE2207bC7008434b7C0eeFF',
      value: '10',
      extraData: 'test'
    }
    mockApi.getAppTx = jest.fn().mockResolvedValue(appTx)
    const res = await transaction.getAppTx()
    expect(res).toEqual(appTx)
  })

  it('sendTxForApp', () => {
    mockApi.sendTxForApp = jest.fn().mockReturnValue(true)
    const res = transaction.sendTxForApp('0.1')
    expect(res).toBe(true)
  })
})
