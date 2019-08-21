import mockDuplex from '@/tests/mock/duplex'
import API from './index'
// import RootStore from '@/stores/root'
import {
  GET_APP_STATE,
  SET_APP_STATE,
  IMPORT_WALLET,
  CREATE_WALLET,
  SET_PASSWORD,
  GET_MNEMONIC,
  UNLOCK_WALLET,
  GET_ACCOUNTS,
  ADD_ACCOUNT,
  DELETE_ACCOUNT,
  GET_ACTIVE_ACCOUNT,
  CHANGE_ACTIVE_ACCOUNT,
  // GET_MIN_TRANSACTION_FEE,
  SEND_TRANSACTION,
  GET_TRANSACTIONS,
  UPDATE_TX_STATUS,
  POPUP_GET_APP_STATE,
  RESET_WALLET,
  UPDATE_ACCOUNT_NAME,
  APP_APPROVE,
  GET_APP_TX,
  APP_SEND,
  CHANGE_NET,
  GET_CURRENT_NET,
  GET_APP_NAME,
  GET_ESTIMATE_GAS
} from '@dipperin/lib/constants'

// jest.mock('@/api')
// import extensionizer from 'extensionizer'
// jest.mock('extensionizer')
// extensionizer.runtime = {
//   connect: jest.fn(() => {
//     return {
//       onMessage: { addListener: jest.fn() },
//       onDisconnect: { addListener: jest.fn() }
//     }
//   })
// }

import RootStore from '@/stores/root'

describe('api', () => {
  const root = ({} as any) as RootStore
  const api = new API(mockDuplex, root)
  const mockSend = jest.fn()
  const mockOn = jest.fn()
  mockDuplex.send = mockSend
  mockDuplex.on = mockOn

  beforeEach(() => {
    mockSend.mockClear()
    mockOn.mockClear()
  })

  it('getCurrentPage', () => {
    api.getCurrentPage()
    expect(mockSend.mock.calls[0][0]).toBe(GET_APP_STATE)
  })

  it('setAppState', () => {
    api.setAppState(1)
    expect(mockSend.mock.calls[0][0]).toBe(SET_APP_STATE)
  })

  it('onAppState', () => {
    api.onAppState(() => {
      return
    })
    expect(mockOn.mock.calls[0][0]).toBe(POPUP_GET_APP_STATE)
  })

  it('importWallet', () => {
    api.importWallet('1', '1')
    expect(mockSend.mock.calls[0][0]).toBe(IMPORT_WALLET)
  })

  it('setPassword', () => {
    api.setPassword('1')
    expect(mockSend.mock.calls[0][0]).toBe(SET_PASSWORD)
  })

  it('getMnemonic', () => {
    api.getMnemonic()
    expect(mockSend.mock.calls[0][0]).toBe(GET_MNEMONIC)
  })

  it('createWallet', () => {
    api.createWallet()
    expect(mockSend.mock.calls[0][0]).toBe(CREATE_WALLET)
  })

  it('unlockWallet', () => {
    api.unlockWallet('1')
    expect(mockSend.mock.calls[0][0]).toBe(UNLOCK_WALLET)
  })

  it('resetWallet', () => {
    api.resetWallet()
    expect(mockSend.mock.calls[0][0]).toBe(RESET_WALLET)
  })

  it('confirmAuth', () => {
    api.confirmAuth()
    expect(mockSend.mock.calls[0][0]).toBe(APP_APPROVE)
  })

  it('getCurrentNet', () => {
    api.getCurrentNet()
    expect(mockSend.mock.calls[0][0]).toBe(GET_CURRENT_NET)
  })

  it('changeNet', () => {
    api.changeNet('test')
    expect(mockSend.mock.calls[0][0]).toBe(CHANGE_NET)
  })

  it('getAppName', () => {
    api.getAppName()
    expect(mockSend.mock.calls[0][0]).toBe(GET_APP_NAME)
  })

  it('getAccounts', () => {
    api.getAccounts()
    expect(mockSend.mock.calls[0][0]).toBe(GET_ACCOUNTS)
  })

  it('getActiveAccount', () => {
    api.getActiveAccount()
    expect(mockSend.mock.calls[0][0]).toBe(GET_ACTIVE_ACCOUNT)
  })

  it('changeActiveAccount', () => {
    api.changeActiveAccount('1')
    expect(mockSend.mock.calls[0][0]).toBe(CHANGE_ACTIVE_ACCOUNT)
  })

  it('addAccount', () => {
    api.addAccount('1')
    expect(mockSend.mock.calls[0][0]).toBe(ADD_ACCOUNT)
  })

  it('deleteAccount', () => {
    api.deleteAccount('1')
    expect(mockSend.mock.calls[0][0]).toBe(DELETE_ACCOUNT)
  })

  it('updateAccountName', () => {
    api.updateAccountName({ id: '1', name: '12' })
    expect(mockSend.mock.calls[0][0]).toBe(UPDATE_ACCOUNT_NAME)
  })

  it('getEstimateGas', () => {
    api.getEstimateGas({ address: '0x0', amount: '1' })
    expect(mockSend.mock.calls[0][0]).toBe(GET_ESTIMATE_GAS)
  })

  it('sendTransaction', () => {
    api.sendTransaction({ address: '0x0', amount: '1' })
    expect(mockSend.mock.calls[0][0]).toBe(SEND_TRANSACTION)
  })

  it('getTransaction', () => {
    api.getTransaction('0x1')
    expect(mockSend.mock.calls[0][0]).toBe(GET_TRANSACTIONS)
  })

  it('onUpdateStatus', () => {
    api.onUpdateStatus(() => {
      return
    })
    expect(mockOn.mock.calls[0][0]).toBe(UPDATE_TX_STATUS)
  })

  it('getAppTx', () => {
    api.getAppTx()
    expect(mockSend.mock.calls[0][0]).toBe(GET_APP_TX)
  })

  it('sendTxForApp', () => {
    api.sendTxForApp({ address: '0x0', amount: '1' })
    expect(mockSend.mock.calls[0][0]).toBe(APP_SEND)
  })
})
