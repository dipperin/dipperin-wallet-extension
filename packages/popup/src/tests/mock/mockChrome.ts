interface Window {
  chrome: typeof chrome
}

declare var window: Window

const mockChrome = ({
  storage: {
    sync: {
      set: jest.fn(),
      get: jest.fn()
    }
  }
} as any) as typeof chrome

window.chrome = mockChrome
window.open = jest.fn()
window.close = jest.fn()
