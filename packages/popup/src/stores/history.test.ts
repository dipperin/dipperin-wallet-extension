import { mockApi } from '@/tests/mock/api'
import History from './history'

describe('historyStore', () => {
  // const mockApi = MockApi()
  let history: History
  mockApi.getCurrentPage = jest.fn().mockResolvedValue(1)
  it('constructor', () => {
    expect(() => {
      history = new History(mockApi)
    }).not.toThrow()
  })

  it('historyPush', () => {
    const setStateSpy = jest.spyOn(mockApi, 'setAppState')
    history.historyPush(0)
    expect(setStateSpy.mock.calls[0][0]).toBe(0)
  })

  it('appState', () => {
    expect(history.appState).toBe(1)
  })
})
