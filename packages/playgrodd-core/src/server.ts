import { load } from 'load-cfg'

import * as paths from './config/paths'
import { pick } from './utils/helpers'

import { Entries } from './Entries'
import { Bundler } from './Bundler'

process.env.BABEL_ENV = process.env.BABEL_ENV || 'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const ENV = process.env.NODE_ENV
const HOST = process.env.HOST || '0.0.0.0'
const PROTOCOL = process.env.HTTPS === 'true' ? 'https' : 'http'

export interface ConfigArgs {
  paths: any
  port: number
  theme: string
  src: string
  env: string
  host: string
  protocol: string
}

export interface IConstructorParams {
  port: number
  theme: string
  files: string
  bundler: string
  src: string
}

export class Server {
  private port: number
  private src: string
  private bundler: Bundler
  private entries: Entries

  constructor(args: IConstructorParams) {
    const initialArgs = this.getInitialArgs(args)
    const { port, theme, files, bundler, src } = load('playgrodd', initialArgs)

    this.port = port
    this.src = src
    this.entries = new Entries(files)

    this.bundler = this.getBundler(bundler).bundler({
      port,
      paths,
      theme,
      src,
      env: ENV,
      host: HOST,
      protocol: PROTOCOL,
    })
  }

  private getInitialArgs(args: IConstructorParams) {
    return pick(['port', 'theme', 'files', 'bundler', 'src'], args)
  }

  private getBundler(bundler: string) {
    try {
      return require(`playgrodd-bundler-${bundler}`)
    } catch (err) {
      return require('playgrodd-bundler-webpack')
    }
  }

  public async start() {
    const { entries, bundler } = this

    const compiler = await bundler.createCompiler(entries.parse(this.src))
    const server = await bundler.createServer(compiler)

    server.listen(this.port)
  }
}
