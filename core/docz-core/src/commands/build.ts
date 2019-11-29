import { Arguments } from 'yargs'
import * as logger from 'signale'

import { parseConfig } from '../config/docz'
import { bundler as gatsby } from '../bundler'
import { init } from './init'
import { copyDoczRc } from '../bundler/machine/services/create-resources'

export const build = async (args: Arguments<any>) => {
  copyDoczRc(args.config)
  const config = await parseConfig(args)
  const bundler = gatsby(config)

  try {
    await init(args)
  } catch (err) {
    logger.error(`Failed to initialize docz : ${err.message}`)
  }

  try {
    await bundler.build()
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}
