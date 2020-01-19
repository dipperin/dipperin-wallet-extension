jest.mock('@/api')
import extensionizer from 'extensionizer'
import '@/tests/mock/mockChrome'
jest.mock('extensionizer')
extensionizer.runtime = {
  connect: jest.fn(() => {
    return {
      onMessage: { addListener: jest.fn() },
      onDisconnect: { addListener: jest.fn() }
    }
  })
}

import RootStore from './root'

describe('RootStore', () => {
  it('init', () => {
    expect(() => {
      return new RootStore()
    }).not.toThrow()
  })
})
