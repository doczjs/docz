import logger from 'signale'
import envDotProp from 'env-dot-prop'

import * as states from '../states'
import { loadConfig } from '../utils/load-config'
import { bundler as webpack } from '../webpack'
import { Entries } from '../Entries'
import { DataServer } from '../DataServer'
import { Plugin } from '../Plugin'
import { Config } from './args'

export const build = async (args: Config) => {
  const env = envDotProp.get('node.env')
  const config = await loadConfig(args)
  const entries = new Entries(config)

  const bundler = webpack(config, env)
  const run = Plugin.runPluginsMethod(config.plugins)
  const dataServer = new DataServer()

  dataServer.register([
    states.config(config),
    states.entries(entries, config),
    states.metadata(entries, config),
  ])

  try {
    await Entries.writeApp(config)
    await dataServer.init()

    await run('onPreBuild', config)
    await bundler.build(await bundler.getConfig(env))
    await run('onPostBuild', config)
    await dataServer.close()
  } catch (err) {
    logger.fatal(err)
    process.exit(1)
  }
}
