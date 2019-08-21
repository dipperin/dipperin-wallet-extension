jest.mock('@/api')
import extensionizer from 'extensionizer'
jest.mock('extensionizer')
extensionizer.runtime = {
  connect: jest.fn(() => {
    return {
      onMessage: { addListener: jest.fn() },
      onDisconnect: { addListener: jest.fn() }
    }
  })
}
