import { shallow } from 'enzyme'
import React from 'react'
import '@/tests/mock/mockChrome'
import '@/tests/mock/extensionizer'
import App from './App'

it('renders without crashing', () => {
  shallow(<App />)
})
