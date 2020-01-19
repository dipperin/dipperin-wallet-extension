import { mockApi } from '@/tests/mock/api'
import WalletStore from '@/stores/wallet'

describe('wallet Store', () => {
  // const mockApi = MockApi()
  let wallet: WalletStore

  it('constructor', () => {
    expect(() => {
      wallet = new WalletStore(mockApi)
    }).not.toThrow()
  })

  it('getMnemonic', async () => {
    mockApi.getMnemonic = jest.fn().mockResolvedValue(true)
    const res = await wallet.getMnenmonic()
    expect(res).toBe(true)
  })

  it('setPassword', async () => {
    mockApi.setPassword = jest.fn().mockResolvedValue(true)
    const res = await wallet.setPassword('12345678')
    expect(res).toBe(true)
  })

  it('createWallet', async () => {
    mockApi.createWallet = jest.fn().mockResolvedValue(true)
    const res = await wallet.createWallet()
    expect(res).toBe(true)
  })

  it('importWallet', async () => {
    mockApi.importWallet = jest.fn().mockResolvedValue(true)
    const res = await wallet.importWallet(
      '12345678',
      'very olive salon brand know muffin uniform garage scout narrow stove solar'
    )
    expect(res).toBe(true)
  })

  it('unlockWallet', async () => {
    mockApi.unlockWallet = jest.fn().mockResolvedValue(true)
    const res = await wallet.unlockWallet('xx')
    expect(res).toBe(true)
  })

  it('resetWallet', () => {
    mockApi.resetWallet = jest.fn()
    wallet.resetWallet()
    expect(mockApi.resetWallet).toHaveBeenCalled()
  })

  it('confirmAuth', async () => {
    mockApi.confirmAuth = jest.fn().mockResolvedValue(true)
    const res = await wallet.confirmAuth()
    expect(res).toBe(true)
  })
})
