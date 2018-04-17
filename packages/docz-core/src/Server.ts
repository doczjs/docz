import { load } from 'load-cfg'
import { FSWatcher } from 'chokidar'
import * as chokidar from 'chokidar'
import del from 'del'

import * as paths from './config/paths'
import { Entry } from './Entry'
import { Entries } from './Entries'
import { Bundler } from './Bundler'
import { Plugin } from './Plugin'

process.env.BABEL_ENV = process.env.BABEL_ENV || 'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

export interface Argv {
  /* io args */
  src: string
  files: string
  bundler: string
  /* template args */
  title: string
  description: string
  theme: string
  /* bundler args */
  env: string
  debug: boolean
  protocol: string
  host: string
  port: number
}

export interface ConfigArgs extends Argv {
  paths?: paths.Paths
  plugins?: Plugin[]
}

export class Server {
  private readonly config: ConfigArgs
  private readonly watcher: FSWatcher
  private readonly bundler: Bundler

  constructor(args: ConfigArgs) {
    const config = load('docz', { ...args, paths, plugins: [] })
    const selectedBundler = this.getBundler(config.bundler)
    const ignoreWatch = {
      ignored: /(^|[\/\\])\../,
    }

    this.config = config
    this.watcher = chokidar.watch(config.files, ignoreWatch)
    this.bundler = selectedBundler.bundler(config)
  }

  public async start(): Promise<void> {
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

  private getBundler(bundler: string): any {
    try {
      return require(`docz-bundler-${bundler}`)
    } catch (err) {
      // tslint:disable-next-line
      return require('docz-bundler-webpack')
    }
  }

  private processEntries(config: ConfigArgs): void {
    const { files, src } = config
    const cache = new Map()

    const generateFilesAndUpdateCache = (entries: Entries) => {
      cache.set('map', entries.map())
      entries.writeFiles(config)
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
}
