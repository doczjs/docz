import { Arguments } from 'yargs'
import * as envDotProp from 'env-dot-prop'
import PrettyError from 'pretty-error'

import { Plugin } from '../lib/Plugin'
import { Entries } from '../lib/Entries'
import { DataServer } from '../lib/DataServer'
import { parseConfig } from '../config/docz'
import { bundler as webpack } from '../bundler'
import * as states from '../states'

const pe = new PrettyError()
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
    await Entries.writeApp(config, true)
    await dataServer.init()

    await run('onPreBuild', config)
    await bundler.build(bundlerConfig)

    await run('onPostBuild', config)
    await dataServer.close()
  } catch (err) {
    pe.render(err)
    process.exit(1)
  }
}
