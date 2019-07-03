process.setMaxListeners(Infinity)

import { Arguments } from 'yargs'
import logger from 'signale'

import { parseConfig } from '../config/docz'
import { bundler as gatsby } from '../bundler'

export const dev = async (args: Arguments<any>) => {
  const config = await parseConfig(args)
  const bundler = gatsby(config)
  const app = await bundler.createApp()

  try {
    await app.start()
  } catch (err) {
    logger.fatal('Failed to process data server')
    logger.error(err)
    process.exit(1)
  }
}
