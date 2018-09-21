import logger from 'signale'
import envDotProp from 'env-dot-prop'

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
    dataServer.register([
      states.entries(config),
      states.config(config),
      states.metadata(config)
    ])
  
    await Entries.writeApp(config)
    await dataServer.init()
return
    await run('onPreBuild', config)
    await bundler.build(await bundler.getConfig(env))
    await run('onPostBuild', config)
  } catch (err) {
    logger.fatal(err)
    process.exit(1)
  }
}
