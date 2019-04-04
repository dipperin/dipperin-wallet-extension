import HostDuplex from './host'
import ChildDuplex from './child'

export type ChannelMap = Map<
  string,
  {
    channel: chrome.runtime.Port
    url: string
  }
>

export type IncomingCallback = (res: any) => void

export type OutgoingCallback = IncomingCallback

export type Res = any

export interface MessageData {
  messageID: string
  error?: Error
  res: Res
}

export interface Message {
  noAck: boolean
  hostname: string
  action: string
  messageID: string
  data: MessageData
}

export class Tab extends ChildDuplex {
  constructor() {
    super('tab')
  }
}

export class Popup extends ChildDuplex {
  constructor() {
    super('popup')
  }
}

export const Host = HostDuplex

export type HostType = InstanceType<typeof Host>
export type TabType = InstanceType<typeof Tab>
export type PopupType = InstanceType<typeof Popup>

export default {
  Host,
  Tab,
  Popup
}
