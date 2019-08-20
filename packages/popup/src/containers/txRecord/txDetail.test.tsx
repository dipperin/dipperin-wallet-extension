import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
// import History from '../../stores/history'
// import Wallet from '../../stores/wallet'
// import Account from '../../stores/account'
// import { mockApi } from '../../tests/mock/api'
// import Label from '../../stores/label'

import TxDetail from './txDetail'

describe('SetPassword', () => {
  // const history = new History(mockApi)
  // const wallet = new Wallet(mockApi)
  // const account = new Account(mockApi)
  // const label = new Label()
  let component: ShallowWrapper
  let instance: TxDetail
  const tx = {
    nonce: '1',
    value: '1',
    hashLock: '0x2a4fb13b1cd57d355686452d192b9df3e57b2b0ef4fef70b51a0a0ba11fd469b',
    to: '0x0000Fa8ce45493EcE6ddDB8cD791fBD833a6B23890cd',
    from: '0x00008AD27452ACD62e646088A76D098156B2358357ff',
    extraData: '',
    status: 'success',
    timeLock: 1,
    timestamp: 1534134131,
    transactionHash: '0x241241231'
  }
  const onClose = jest.fn()

  beforeEach(() => {
    component = shallow(<TxDetail transaction={tx} onClose={onClose} />)
    instance = component.instance() as TxDetail
  })
  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('handleClose', () => {
    instance.handleClose()
    expect(onClose).toHaveBeenCalled()
  })

  it('formatBalance', () => {
    expect(instance.formatBalance('1000000000000000000')).toBe('1 DIP')
  })

  it('formatDate', () => {
    const res = instance.formatDate(1566214720782)
    expect(res).toBe(new Date(1566214720782).toString())
  })
})
