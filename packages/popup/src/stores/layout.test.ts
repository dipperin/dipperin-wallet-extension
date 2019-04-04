import Layout from './layout'

describe('layout Store', () => {
  const layout = new Layout()
  jest.useFakeTimers()

  it('handleOpenLoading', () => {
    layout.handleOpenLoading()
    expect(layout.loadingHandler.time).toBeGreaterThan(0)
    expect(layout.loadingHandler.show).toBe(true)
    jest.runAllTimers()
    expect(layout.loadingHandler.show).toBe(false)
  })

  it('handleCloseLoading after less than 1100ms', () => {
    layout.handleOpenLoading()
    layout.handleCloseLoading()
    expect(layout.loadingHandler.show).toBe(true)
    jest.runAllTimers()
    expect(layout.loadingHandler.show).toBe(false)
  })

  it('handleCloseLoading after longer than 1100ms', async () => {
    layout.handleOpenLoading()
    await setTimeout(() => {
      layout.handleCloseLoading()
    }, 1200)
    jest.runAllTimers()
    expect(layout.loadingHandler.show).toBe(false)
  })
})
