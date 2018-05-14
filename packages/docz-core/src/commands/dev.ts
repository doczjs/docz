import { load } from 'load-cfg'
import chokidar from 'chokidar'

import * as paths from '../config/paths'
import { Config } from './args'

import { Entries } from '../Entries'
import { webpack } from '../bundlers'

process.env.BABEL_ENV = process.env.BABEL_ENV || 'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const handleUpdate = (entries: Entries) => (file: string) => {
  entries.update(file)
  entries.rewrite()
}

const handleRemove = (entries: Entries) => (file: string) => {
  entries.remove(file)
  entries.rewrite()
}

const handleRemoveDir = (entries: Entries) => (
  event: string,
  path: string,
  details: any
) => {
  if (details.event === 'moved' && details.type === 'directory') {
    entries.clean(details.path)
    entries.rewrite()
  }
}

const writeEntriesAndWatch = (config: Config) => {
  const entries = new Entries(config)
  const watcher = chokidar.watch(config.files, {
    ignored: /(^|[\/\\])\../,
  })

  watcher
    .on('change', handleUpdate(entries))
    .on('unlink', handleRemove(entries))
    .on('raw', handleRemoveDir(entries))

  entries.write()
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
  const server = await bundler.createServer(bundler.getConfig())

  writeEntriesAndWatch(config)
  server.start()
}
