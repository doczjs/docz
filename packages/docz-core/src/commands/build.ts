import * as fs from 'fs-extra'

import * as paths from '../config/paths'
import { loadConfig } from '../utils/load-config'
import { webpack } from '../bundlers'
import { Entries } from '../Entries'
import { Config } from './args'

export const build = async (args: Config) => {
  const config = loadConfig(args)
  const bundler = webpack(config, 'production')
  const entries = new Entries(config)
  const map = await entries.getMap()

  await fs.remove(paths.app)
  await Entries.writeApp(config)
  await Entries.writeImports(map)
  await Entries.writeData(map, config)

  await bundler.build()
}
