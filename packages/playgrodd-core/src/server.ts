import { load } from 'load-cfg'

import * as paths from './config/paths'
import { pick } from './utils/helpers'

import { Entries } from './Entries'
import { Bundler, BundlerFactory } from './Bundler'

process.env.BABEL_ENV = process.env.BABEL_ENV || 'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

export interface IConstructorParams {
  port: number
  theme: string
  files: string
  bundler: string
}

export class Server {
  private port: number
  private theme: string
  private bundler: Bundler
  private entries: Entries

  constructor(args: IConstructorParams) {
    const initialArgs = this.getInitialArgs(args)
    const { port, theme, files, bundler } = load('playgrodd', initialArgs)

    this.port = port
    this.theme = theme
    this.entries = new Entries(files)
    this.bundler = this.getBundler(bundler).create({ port, paths })
  }

  private getInitialArgs(args: IConstructorParams) {
    return pick(['port', 'theme', 'files', 'bundler'], args)
  }

  private getBundler(bundler: string): BundlerFactory {
    try {
      return require(`playgrodd-bundler-${bundler}`)
    } catch (err) {
      return require('playgrodd-bundler-webpack')
    }
  }

  public async start() {
    const entries = this.entries.parse()
    const compiler = await this.bundler.createCompiler(this.theme, entries)
    const server = await this.bundler.createServer(compiler)

    server.listen(this.port)
  }
}
