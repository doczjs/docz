import { load } from 'load-cfg'
import chokidar from 'chokidar'

import * as paths from '../config/paths'
import { Config } from './args'

import { Entries, EntryMap } from '../Entries'
import { webpack } from '../bundlers'

process.env.BABEL_ENV = process.env.BABEL_ENV || 'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

export type Rewrite = (entries: EntryMap) => Promise<void>

const handleUpdate = (rewrite: Rewrite) => (entries: Entries) => async (
  file: string
) => {
  const newEntries = await entries.update(file)
  await rewrite(newEntries)
}

const handleRemove = (rewrite: Rewrite) => (entries: Entries) => async (
  file: string
) => {
  const newEntries = entries.remove(file)
  await rewrite(newEntries)
}

const handleRemoveDir = (rewrite: Rewrite) => (entries: Entries) => async (
  event: string,
  path: string,
  details: any
) => {
  if (details.event === 'moved' && details.type === 'directory') {
    const newEntries = await entries.clean(details.path)
    await rewrite(newEntries)
  }
}

const writeEntriesAndWatch = async (config: Config) => {
  const instance = new Entries(config)
  const entries = await instance.getMap()

  const write = Entries.write(config)
  const rewrite = Entries.rewrite(config)
  const onChange = handleUpdate(rewrite)
  const onUnlinkDir = handleRemove(rewrite)
  const onRaw = handleRemoveDir(rewrite)

  const watcher = chokidar.watch(config.files, {
    ignored: /(^|[\/\\])\../,
  })

  watcher
    .on('change', onChange(instance))
    .on('unlink', onUnlinkDir(instance))
    .on('raw', onRaw(instance))

  await write(entries)
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

  await writeEntriesAndWatch(config)
  server.start()
}
