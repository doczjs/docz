import { Arguments } from 'yargs'
import * as logger from 'signale'

import { parseConfig } from '../config/docz'
import { bundler as gatsby } from '../bundler'

export const build = async (args: Arguments<any>) => {
  const config = await parseConfig(args)
  const bundler = gatsby(config)

  try {
    await bundler.build()
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}
