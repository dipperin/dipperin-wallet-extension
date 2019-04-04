import BackgroundScript from './backgroundScript'

describe('BackgroundScript', () => {
  it('constructor', () => {
    expect(() => {
      const bs = new BackgroundScript()
      bs.run()
    }).not.toThrow()
  })
})
