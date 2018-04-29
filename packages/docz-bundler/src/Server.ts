import { load } from 'load-cfg'
import { FSWatcher } from 'chokidar'
import * as chokidar from 'chokidar'
import * as del from 'del'

import * as paths from './config/paths'

import { Entry } from './Entry'
import { Entries } from './Entries'
import { Bundler } from './Bundler'
import { Plugin } from './Plugin'

import { bundler } from './webpack'

process.env.BABEL_ENV = process.env.BABEL_ENV || 'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

export interface Argv {
  /* io args */
  src: string
  files: string
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
  paths: paths.Paths
  plugins?: Plugin[]
  mdxOptions?: {
    mdPlugins: any[]
    hastPlugins: any[]
  }
}

const initialConfigArgs = {
  paths,
  plugins: [],
  mdxOptions: {
    mdPlugins: [],
    hastPlugins: [],
  },
}

export class Server {
  private readonly config: ConfigArgs
  private readonly watcher: FSWatcher
  private readonly bundler: Bundler

  constructor(args: ConfigArgs) {
    const config = load('docz', { ...args, ...initialConfigArgs })
    const ignoreWatch = {
      ignored: /(^|[\/\\])\../,
    }

    this.config = config
    this.watcher = chokidar.watch(config.files, ignoreWatch)
    this.bundler = bundler(config)
  }

  public async start(): Promise<void> {
    del.sync(paths.docz)
    this.processEntries(this.config)

    const config = this.bundler.getConfig()
    const server = await this.bundler.createServer(config)

    server.start()
  }

  private processEntries(config: ConfigArgs): void {
    const entries = new Entries(config)
    const update = () => entries.write()

    const onUnlink = (file: string) => {
      entries.remove(file)
      update()
    }

    const onChange = (file: string) => {
      const name = Entry.parseName(file)
      const entry = entries.find(file)

      if (name) {
        !entry && entries.add(new Entry(file, config.src))
        entry && entries.update(file)
        update()
      }
    }

    this.watcher.on('unlink', onUnlink)
    this.watcher.on('change', onChange)

    update()
  }
}
