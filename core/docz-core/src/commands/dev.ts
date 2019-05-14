process.setMaxListeners(Infinity)

import { Arguments } from 'yargs'
import logger from 'signale'
import * as envDotProp from 'env-dot-prop'

import { parseConfig } from '../config/docz'
import { bundler as gatsby } from '../bundler'
import { openBrowser } from '../utils/open-browser'

export const dev = async (args: Arguments<any>) => {
  const env = envDotProp.get('node.env')
  const config = await parseConfig(args)
  const bundler = gatsby(config, env)
  const bundlerConfig = await bundler.mountConfig(env)
  const app = await bundler.createApp(bundlerConfig)

  try {
    await app.start()
    if (args.open || args.o) openBrowser(`http://${config.host}:${config.port}`)
  } catch (err) {
    logger.fatal('Failed to process data server')
    logger.error(err)
    process.exit(1)
  }
}
