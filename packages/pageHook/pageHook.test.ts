import PageHook from './pageHook'

describe('PageHook', () => {
  it('constructor', () => {
    expect(() => {
      const ph = new PageHook()
      ph.init()
    }).not.toThrow()
  })
})
