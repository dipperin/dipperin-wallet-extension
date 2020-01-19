import mockDuplex from './duplex'
// import API from '@/api'

// export const MockApi = () => new API(mockDuplex)

const api = {
  // duplex: new Popup(),
  getCurrentPage: jest.fn().mockResolvedValue(''),
  setAppState: jest.fn(),
  onAppState: jest.fn(),
  importWallet: jest.fn().mockResolvedValue(''),
  setPassword: jest.fn().mockResolvedValue(''),
  getMnemonic: jest.fn().mockResolvedValue(''),
  createWallet: jest.fn().mockResolvedValue(''),
  unlockWallet: jest.fn().mockResolvedValue(''),
  resetWallet: jest.fn(),
  confirmAuth: jest.fn().mockResolvedValue(''),
  /** for account store  */
  getAccounts: jest.fn().mockResolvedValue([]),
  getActiveAccount: jest.fn().mockResolvedValue({
    name: '1',
    address: '0x00007B71014bd3AdfB86bC0E774605F85DE850F89192',
    id: '2',
    path: `m/44'/709394'/0'/0/2`,
    balance: '0',
    lockBalance: '0',
    type: 0
  }),
  changeActiveAccount: jest.fn().mockResolvedValue(''),
  addAccount: jest.fn().mockResolvedValue(''),
  deleteAccount: jest.fn(),
  updateAccountName: jest.fn().mockResolvedValue(''),
  /** for transaction store  */
  getMinTxFee: jest.fn().mockResolvedValue(''),
  sendTransaction: jest.fn().mockResolvedValue(''),
  getTransaction: jest.fn().mockResolvedValue(''),
  onUpdateStatus: jest.fn(),
  getAppTx: jest.fn().mockResolvedValue(''),
  sendTxForApp: jest.fn().mockResolvedValue(''),
  /** EventListener */
  addEventListener: jest.fn()
}

export const mockApi = Object.create(api, {
  duplex: {
    configurable: true,
    enumerable: true,
    writable: true,
    value: mockDuplex
  }
})
// mockApi.prototype.duplex = new Popup()
