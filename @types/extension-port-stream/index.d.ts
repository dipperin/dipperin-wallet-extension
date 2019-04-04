declare module 'extension-port-stream' {
  import { Duplex } from 'stream'
  export default class extends Duplex {
    constructor(port: chrome.runtime.Port)
  }
}
