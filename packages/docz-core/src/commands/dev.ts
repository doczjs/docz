import { load } from 'load-cfg'
import chokidar from 'chokidar'
import del from 'del'

import * as paths from '../config/paths'
import { Entry } from '../Entry'
import { Entries } from '../Entries'
import { webpack } from '../bundlers'
import { Config } from './args'

process.env.BABEL_ENV = process.env.BABEL_ENV || 'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const INITIAL_CONFIG = {
  paths,
  plugins: [],
  mdPlugins: [],
  hastPlugins: [],
}

const writeEntriesAndWatch = (config: Config) => {
  const watcher = chokidar.watch(config.files, {
    ignored: /(^|[\/\\])\../,
  })

  const entries = new Entries(config)

  const onUnlink = (file: string) => {
    entries.remove(file)
    entries.rewrite()
  }

  const onChange = (file: string) => {
    const name = Entry.parseName(file)

    if (name) {
      entries.update(file)
      entries.rewrite()
    }
  }

  watcher.on('unlink', onUnlink)
  watcher.on('change', onChange)

  entries.write()
}

export const dev = async (args: Config) => {
  const config = load('docz', { ...args, ...INITIAL_CONFIG })
  const bundler = webpack(config)
  const server = await bundler.createServer(bundler.getConfig())

  await del(paths.docz)
  writeEntriesAndWatch(config)
  server.start()
}
