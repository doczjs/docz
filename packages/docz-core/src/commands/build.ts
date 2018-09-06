import logger from 'signale'
import envDotProp from 'env-dot-prop'
import * as states from '../states'
import { loadConfig } from '../utils/load-config'
import { webpack } from '../bundlers'
import { Entries } from '../Entries'
import { DataServer } from '../DataServer'
import { Plugin } from '../Plugin'
import { Config } from './args'
import { prerender, writeEntries } from '../utils/prerender'

export const build = async (args: Config) => {
  const env = envDotProp.get('node.env')
  const config = loadConfig(args)
  const run = Plugin.runPluginsMethod(config.plugins)
  const dataServer = new DataServer()

  try {
    dataServer.register([states.entries(config), states.config(config)])
    await Entries.writeApp(config)
    await dataServer.init()
    const state = dataServer.getState()

    const bundler = webpack(
      {
        ...config,
        entries: state.entries,
        prerender: true,
      },
      env
    )

    await run('onPreBuild')
    await bundler.build(await bundler.getConfig(env))
    const preRendered = await prerender(config, state)
    writeEntries(config, preRendered)
    await run('onPostBuild')
  } catch (err) {
    logger.fatal(err)
    process.exit(1)
  }
}
