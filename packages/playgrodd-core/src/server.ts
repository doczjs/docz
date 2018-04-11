import * as bundlers from './bundlers'
import { Entries } from './Entries'
import { prop } from './utils/helpers'

interface IConstructorParams {
  port: number
  files: string
  bundler: 'webpack'
}

export class Server {
  private bundler: any
  private entries: Entries
  private port: number

  constructor({ port, bundler, files: pattern }: IConstructorParams) {
    this.port = port
    this.entries = new Entries(pattern)
    this.bundler = prop(bundler, bundlers)({ port })
  }

  public async start() {
    const entries = this.entries.parse()
    const compiler = await this.bundler.createCompiler(entries)
    const server = await this.bundler.createServer(compiler)

    server.listen(this.port)
  }
}
