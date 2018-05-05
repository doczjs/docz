import { load } from 'load-cfg'
import { FSWatcher } from 'chokidar'
import * as chokidar from 'chokidar'
import del from 'del'

import * as paths from '../config/paths'

import { Entry } from '../Entry'
import { Entries } from '../Entries'
import { Bundler } from '../Bundler'

import { webpack } from '../bundlers'
import { Config } from './args'

process.env.BABEL_ENV = process.env.BABEL_ENV || 'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const writeEntriesAndWatch = (watcher: FSWatcher) => (config: Config) => {
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

  watcher.on('unlink', onUnlink)
  watcher.on('change', onChange)

  update()
}

const start = async (bundler: Bundler): Promise<void> => {
  const config = bundler.getConfig()
  const server = await bundler.createServer(config)

  server.start()
}

const INITIAL_CONFIG = {
  paths,
  plugins: [],
  mdPlugins: [],
  hastPlugins: [],
}

export const dev = async (args: Config) => {
  const config = load('docz', { ...args, ...INITIAL_CONFIG })
  const bundler = webpack(config)
  const watcher = chokidar.watch(config.files, {
    ignored: /(^|[\/\\])\../,
  })

  const writeEntries = writeEntriesAndWatch(watcher)

  await del(paths.docz)
  writeEntries(config)
  start(bundler)
}
