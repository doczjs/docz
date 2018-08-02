import * as fs from 'fs-extra'
import logger from 'signale'
import envDotProp from 'env-dot-prop'

import * as paths from '../config/paths'
import * as states from '../states'
import { loadConfig } from '../utils/load-config'
import { webpack } from '../bundlers'
import { Entries } from '../Entries'
import { DataServer } from '../DataServer'
import { Plugin } from '../Plugin'
import { Config } from './args'

export const build = async (args: Config) => {
  const env = envDotProp.get('node.env')
  const config = loadConfig(args)
  const bundler = webpack(config, env)
  const run = Plugin.runPluginsMethod(config.plugins)
  const dataServer = new DataServer()

  try {
    await fs.remove(paths.app)
    await Entries.writeApp(config)

    dataServer.register([states.entries(config), states.config(config)])
    await dataServer.init()

    await run('onPreBuild')
    await bundler.build(await bundler.getConfig(env))
    await run('onPostBuild')
  } catch (err) {
    logger.fatal(err)
    process.exit(1)
  }
}
