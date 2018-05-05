import { load } from 'load-cfg'
import del from 'del'

import * as paths from '../config/paths'
import { Entries } from '../Entries'
import { Bundler } from '../Bundler'
import { webpack } from '../bundlers'
import { Config } from './args'

process.env.BABEL_ENV = process.env.BABEL_ENV || 'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

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
  const entries = new Entries(config)

  await del(paths.docz)
  entries.write()
  start(bundler)
}
