import { Arguments } from 'yargs'
import * as logger from 'signale'
import * as envDotProp from 'env-dot-prop'

import { Plugin } from '../lib/Plugin'
import { parseConfig } from '../config/docz'
import { bundler as gatsby } from '../bundler'

export const build = async (args: Arguments<any>) => {
  const env = envDotProp.get('node.env')
  const config = await parseConfig(args)
  const bundler = gatsby(config, env)
  const bundlerConfig = await bundler.mountConfig(env)
  const run = Plugin.runPluginsMethod(config.plugins)

  try {
    await run('onPreBuild', config)
    await bundler.build(bundlerConfig)
    await run('onPostBuild', config)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}
