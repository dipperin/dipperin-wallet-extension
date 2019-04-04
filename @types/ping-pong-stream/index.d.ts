declare module 'ping-pong-stream' {
  import { Duplex, DuplexOptions } from 'stream'

  interface PingOptions extends DuplexOptions {
    heartbeatPollingInterval?: number
    heartbeatTimeout?: number
    heartbeatRequest?: string
    heartbeatResponse?: string
  }

  export class PingStream extends Duplex {
    constructor(opts: PingOptions)
    stop(): void
  }

  interface PongOptions extends DuplexOptions {
    heartbeatRequest?: string
    heartbeatResponse?: string
  }

  export class PongStream extends Duplex {
    constructor(opts: PongOptions)
  }
}
