import { Popup } from '@dipperin/lib/duplex'

jest.mock('@dipperin/lib/duplex')

export const mockPopup = Popup
const mockDuplex = new mockPopup()

export default mockDuplex
