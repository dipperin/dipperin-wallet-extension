declare module 'obj-multiplex' {
  import { Duplex, DuplexOptions } from 'stream'
  export default class ObjectMultiplex extends Duplex {
    constructor(opts?: DuplexOptions)
    createStream(name: string): Substream
    ignoreStream(name: string): void
  }

  class Substream extends Duplex {
    constructor({ parent, name }: { parent: ObjectMultiplex; name: string })
  }
}
