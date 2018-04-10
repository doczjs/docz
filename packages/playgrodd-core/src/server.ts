import * as bundlers from './bundlers'
import { Entries } from './Entries'

const prop = (key: string, obj: any) => obj[key]

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
    this.bundler = prop(bundler, bundlers)()
    this.entries = new Entries(pattern)
  }

  public async start() {
    const entries = this.entries.parse()
    const compiler = await this.bundler.createCompiler(entries)
    const server = await this.bundler.createServer(compiler)

    server.listen(this.port)
  }
}
