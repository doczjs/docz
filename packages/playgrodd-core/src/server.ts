import * as paths from './config/paths'
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

  constructor({ port, bundler, files: pattern, theme }: IConstructorParams) {
    this.port = port
    this.theme = theme
    this.entries = new Entries(pattern)
    this.bundler = this.getBundler(bundler).create({ port, paths })
  }

  private getBundler(bundler: string): BundlerFactory {
    try {
      return require(`playgrodd-bundler-${bundler}`)
    } catch (err) {
      return require('playgrodd-bundler-webpack')
    }
  }

  private getTheme() {
    return `playgrodd-theme-${this.theme}`
  }

  public async start() {
    const theme = this.getTheme()
    const entries = this.entries.parse()
    const compiler = await this.bundler.createCompiler(theme, entries)
    const server = await this.bundler.createServer(compiler)

    server.listen(this.port)
  }
}
