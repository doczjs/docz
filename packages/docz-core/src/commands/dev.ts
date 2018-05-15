import { load } from 'load-cfg'
import chokidar from 'chokidar'

import * as paths from '../config/paths'
import { Config } from './args'

import { Entries } from '../Entries'
import { webpack } from '../bundlers'

process.env.BABEL_ENV = process.env.BABEL_ENV || 'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const writeEntriesAndWatch = async (config: Config) => {
  const entries = new Entries(config)
  const map = await entries.getMap()

  const handleUpdate = async () => Entries.rewrite(config)
  const handleRaw = async (event: string, path: string, details: any) => {
    if (details.event === 'moved' && details.type === 'directory') {
      handleUpdate()
    }
  }

  const watcher = chokidar.watch(config.files, {
    ignored: /(^|[\/\\])\../,
  })

  watcher
    .on('change', handleUpdate)
    .on('unlink', handleUpdate)
    .on('raw', handleRaw)

  await Entries.write(config, map)
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
