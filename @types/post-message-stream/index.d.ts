declare module 'post-message-stream' {
  import { Duplex, DuplexOptions } from 'stream'

  interface Options extends DuplexOptions {
    name: string
    target: string
    targetWindow?: typeof window
    origin?: string
  }

  export default class extends Duplex {
    constructor(opts: Options)
  }
}
