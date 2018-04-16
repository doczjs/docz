import { load } from 'load-cfg'
import { FSWatcher } from 'chokidar'
import * as chokidar from 'chokidar'
import del from 'del'

import * as paths from './config/paths'
import { pick } from './utils/helpers'

import { Entry } from './Entry'
import { Entries } from './Entries'
import { Bundler } from './Bundler'
import { Plugin } from './Plugin'

process.env.BABEL_ENV = process.env.BABEL_ENV || 'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const ENV = process.env.NODE_ENV
const HOST = process.env.HOST || '0.0.0.0'
const PROTOCOL = process.env.HTTPS === 'true' ? 'https' : 'http'

export interface IServerConstructor {
  port: number
  theme: string
  files: string
  bundler: string
  src: string
}

export interface ConfigArgs extends IServerConstructor {
  paths: any
  env: string
  host: string
  protocol: string
  plugins: Plugin[]
}

export class Server {
  readonly config: ConfigArgs
  readonly watcher: FSWatcher
  private bundler: Bundler

  constructor(args: IServerConstructor) {
    const initialArgs = this.getInitialArgs(args)
    const config = load('docz', initialArgs)

    this.config = config
    this.watcher = chokidar.watch(config.files, {
      ignored: /(^|[\/\\])\../,
    })

    this.bundler = this.getBundler(config.bundler).bundler({
      ...config,
      paths,
      env: ENV,
      host: HOST,
      protocol: PROTOCOL,
    })
  }

  private getInitialArgs(args: IServerConstructor) {
    return {
      ...pick(['port', 'theme', 'files', 'bundler', 'src'], args),
      plugins: [],
    }
  }

  private getBundler(bundler: string) {
    try {
      return require(`docz-bundler-${bundler}`)
    } catch (err) {
      return require('docz-bundler-webpack')
    }
  }

  private processEntries(config: ConfigArgs) {
    const { files, src, theme, plugins } = config
    const cache = new Map()

    const generateFilesAndUpdateCache = (entries: Entries) => {
      cache.set('map', entries.map())
      Entries.generateFiles({ entries: entries.all, plugins, theme })
    }

    const updateEntries = () =>
      generateFilesAndUpdateCache(new Entries(files, src))

    const parseToUpdate = (path: string) => {
      const name = Entry.parseName(path)
      const entry = cache.get('map')[path]
      const newEntries = new Entries(files, src)

      if (name && name !== entry && newEntries.files.includes(path)) {
        generateFilesAndUpdateCache(newEntries)
      }
    }

    this.watcher.on('unlink', updateEntries)
    this.watcher.on('change', parseToUpdate)

    generateFilesAndUpdateCache(new Entries(files, src))
  }

  public async start() {
    const { plugins, port } = this.config

    del.sync(paths.docz)
    this.processEntries(this.config)

    const compiler = await this.bundler.createCompiler()
    const server = await this.bundler.createServer(compiler)

    if (plugins && plugins.length > 0) {
      for (const plugin of plugins) {
        await plugin.bundlerCompiler(compiler)
        await plugin.bundlerServer(server)
      }
    }

    server.listen(port)
  }
}
