import * as fs from 'fs-extra'
import logger from 'signale'
import envDotProp from 'env-dot-prop'

import * as paths from '../config/paths'
import { loadConfig } from '../utils/load-config'
import { webpack } from '../bundlers'
import { Entries } from '../Entries'
import { Config } from './args'
import { Plugin } from '../Plugin'

export const build = async (args: Config) => {
  const env = envDotProp.get('node.env')
  const config = loadConfig(args)
  const bundler = webpack(config, env)
  const entries = new Entries(config)
  const map = await entries.get()
  const run = Plugin.runPluginsMethod(config.plugins)

  await fs.remove(paths.app)
  await Entries.writeApp(config)
  await Entries.writeImports(map)
  await Entries.writeData(map, config)

  try {
    await run('onPreBuild')
    await bundler.build(await bundler.getConfig(env))
    await run('onPostBuild')
  } catch (err) {
    logger.fatal(err)
    process.exit(1)
  }
}
