import { Arguments } from 'yargs'
import * as logger from 'signale'
import * as envDotProp from 'env-dot-prop'

import { Plugin } from '../lib/Plugin'
import { Entries } from '../lib/Entries'
import { DataServer } from '../lib/DataServer'
import { parseConfig } from '../config/docz'
import { bundler as webpack } from '../bundler'
import * as states from '../states'

export const build = async (args: Arguments<any>) => {
  const env = envDotProp.get('node.env')
  const config = await parseConfig(args)
  const entries = new Entries(config)

  const bundler = webpack(config, env)
  const bundlerConfig = await bundler.mountConfig(env)
  const run = Plugin.runPluginsMethod(config.plugins)
  const dataServer = new DataServer()

  if (args.propsParser) dataServer.register([states.props(config)])
  dataServer.register([states.config(config), states.entries(entries, config)])

  try {
    await Entries.writeApp(config, false)
    await Entries.writeImports(await entries.get())
    await dataServer.start()
    await run('onPreBuild', config)
    await bundler.build(bundlerConfig)
    await run('onPostBuild', config)
    dataServer.close()
  } catch (err) {
    logger.error(err)
    process.exit(1)
    dataServer.close()
  }
}
