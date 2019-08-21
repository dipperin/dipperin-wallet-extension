import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import '@/tests/mock/mockChrome'
import History from '../../stores/history'
import Wallet from '../../stores/wallet'
import Layout from '../../stores/layout'
import { mockApi } from '../../tests/mock/api'
import Label from '../../stores/label'

import BackupConfirm from './index'

describe('BackupConfirm', () => {
  const history = new History(mockApi)
  const wallet = new Wallet(mockApi)
  const label = new Label()
  const layout = new Layout()
  let component: ShallowWrapper

  beforeEach(() => {
    component = shallow(<BackupConfirm wallet={wallet} history={history} label={label} layout={layout} />)
  })
  it('render', () => {
    expect(component.exists()).toBe(true)
  })
})
