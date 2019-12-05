import { verifyEnteringAmount, formatAmount } from './index'

const verifyEnteringAmountTestData = [
  { input: '0.1', result: true },
  { input: '2131654879413', result: true },
  { input: '0100000000000000000000000000000', result: true },
  { input: '0.000000000000000001', result: true },
  { input: '0.0000000000000000001', result: false },
  { input: '0.00000000000000000001', result: false },
  { input: '.123456789012345678', result: true },
  { input: '.123.', result: false }
]

it('verifyEnteringAmount', () => {
  verifyEnteringAmountTestData.forEach(item => {
    expect(verifyEnteringAmount(item.input)).toBe(item.result)
  })
})

const formatAmountTestData = [{ input: '0.', result: '0' }, { input: '.1', result: '0.1' }, { input: '.', result: '0' }]

it('formatAmount', () => {
  formatAmountTestData.forEach(item => {
    expect(formatAmount(item.input)).toBe(item.result)
  })
})
