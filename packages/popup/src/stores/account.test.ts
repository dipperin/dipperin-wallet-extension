import { mockApi } from '@/tests/mock/api'
// import { MockApi} from '@/tests/mock/api'
import AccountStore from './account'
import mockAccounts from '@/tests/testData/accounts'

describe('AccountStore', () => {
  // const mockApi = MockApi()
  let account: AccountStore
  it('constructor', () => {
    expect(() => {
      account = new AccountStore(mockApi)
    }).not.toThrow()
  })

  it('accountList', () => {
    expect(account.accountList).toEqual([])
  })

  it('account useNet:', () => {
    expect(account.useNet).toBe('testNet')
  })

  it('getAccountInfo', async () => {
    mockApi.getAccounts = jest.fn().mockResolvedValue(mockAccounts)
    await account.getAccountInfo()
    expect(account.accountList).toEqual(mockAccounts)
  })

  it('getActiveAccount', async () => {
    mockApi.getActiveAccount = jest.fn().mockResolvedValue(mockAccounts[0])
    await account.getActiveAccount()
    expect(account.activeAccount).toEqual(mockAccounts[0])
  })

  it('changeCurrentAccount', () => {
    account.changeCurrentAccount('2')
    expect(account.activeAccount).toEqual(mockAccounts[1])
  })

  it('addAccount', async () => {
    mockApi.addAccount = jest.fn().mockResolvedValue(true)
    const res = await account.addAccount('testName')
    expect(res).toBe(true)
  })

  it('updateAccountName', async () => {
    mockApi.updateAccountName = jest.fn().mockResolvedValue(true)
    const param = {
      id: '1',
      name: 'test1'
    }
    const res = await account.updateAccountName(param)
    expect(res).toBe(true)
  })

  it('updateAccountStore', () => {
    const getAccountInfoSpy = jest.spyOn(account, 'getAccountInfo')
    const getActiveAccountSpy = jest.spyOn(account, 'getActiveAccount')
    account.updateAccountStore()
    expect(getAccountInfoSpy).toHaveBeenCalled()
    expect(getActiveAccountSpy).toHaveBeenCalled()
  })
})
