import ContentScript from './contentScript'

describe('ContentScript', () => {
  it('constructor', () => {
    expect(() => {
      const cs = new ContentScript()
      cs.init()
    }).not.toThrow()
  })
})
