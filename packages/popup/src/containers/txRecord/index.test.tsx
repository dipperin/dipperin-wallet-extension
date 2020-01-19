import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import '@/tests/mock/mockChrome'

import History from '@/stores/history'
import Wallet from '@/stores/wallet'
import Account from '@/stores/account'
import Transaction from '@/stores/transaction'
import { mockApi } from '@/tests/mock/api'
import Label from '@/stores/label'

import TxRecord from './index'

describe('TxRecord', () => {
  const history = new History(mockApi)
  const wallet = new Wallet(mockApi)
  const account = new Account(mockApi)
  const transaction = new Transaction(mockApi)
  const label = new Label()
  let component: ShallowWrapper
  let instance: TxRecord

  beforeEach(() => {
    component = shallow(
      <TxRecord account={account} wallet={wallet} history={history} label={label} transaction={transaction} />
    ).dive()
    instance = component.instance() as TxRecord
  })

  it('render', () => {
    expect(component.exists()).toBe(true)
  })

  it('setTransactions', () => {
    const txs = [
      {
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
    ]
    instance.setTransactions(txs)
    expect(instance.transactions.length).toBe(1)
  })

  it('maxPage', () => {
    const txs = [
      {
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
    ]
    instance.setTransactions(txs)
    expect(instance.maxPage).toBe(1)
  })

  it('handlePageChange', () => {
    const txs = [
      {
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
    ]
    instance.setTransactions(txs)
    instance.handlePageChange(1)
    expect(instance.currentPage).toBe(0)
  })

  it('pageTitle', () => {
    expect(instance.pageTitle).toBe('')
  })

  it('turnToAccount', () => {
    history.historyPush = jest.fn()
    instance.turnToAccount()
    expect(history.historyPush).toHaveBeenCalled()
  })

  it('formatTime', () => {
    expect(instance.formatTime(1566208829481).length).toBe(14)
  })

  it('formatAddress', () => {
    expect(instance.formatAddress('0x00008AD27452ACD62e646088A76D098156B2358357ff')).toBe('0x0...57ff')
  })

  it('formatAddress empty', () => {
    expect(instance.formatAddress('')).toBe('')
  })

  it('formatBalance', () => {
    expect(instance.formatBalance('1000000000000000000')).toBe('1 DIP')
  })

  it('handleCloseDetail', () => {
    instance.handleCloseDetail()
    expect(instance.showDetail).toBe(false)
  })

  it('handleTurnDetail', () => {
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
    instance.handleTurnDetail(tx)
    expect(instance.showDetail).toBe(true)
  })
})
