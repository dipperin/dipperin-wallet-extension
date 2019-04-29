import { shallow, ShallowWrapper } from 'enzyme'
import React from 'react'
import History from '../../stores/history'
import Wallet from '../../stores/wallet'
import Layout from '../../stores/layout'
import { mockApi } from '../../tests/mock/api'
import Label from '../../stores/label'

import Unlock from './index'

describe('Unlock', () => {
  const history = new History(mockApi)
  const wallet = new Wallet(mockApi)
  const layout = new Layout()
  const label = new Label()
  let component: ShallowWrapper

  beforeEach(() => {
    component = shallow(<Unlock layout={layout} wallet={wallet} history={history} label={label} />)
  })
  it('render', () => {
    expect(component.exists()).toBe(true)
  })
})
