import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import History from '../../stores/history'
import Wallet from '../../stores/wallet'
import Layout from '../../stores/layout'
import { mockApi } from '../../tests/mock/api'
import Label from '../../stores/label'

import Import from './index'

describe('Import', () => {
  const history = new History(mockApi)
  const wallet = new Wallet(mockApi)
  const label = new Label()
  const layout = new Layout()
  let component: ShallowWrapper

  beforeEach(() => {
    component = shallow(<Import wallet={wallet} history={history} label={label} layout={layout} />)
  })
  it('render', () => {
    expect(component.exists()).toBe(true)
  })
})
