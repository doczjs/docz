import { Arguments } from 'yargs'
import * as logger from 'signale'

import { parseConfig } from '../config/docz'
import { bundler as gatsby } from '../bundler'
import { getIsFirstInstall } from '../bundler/machine/actions'
import { init } from './init'

export const build = async (args: Arguments<any>) => {
  const config = await parseConfig(args)
  const bundler = gatsby(config)
  const isFirstInstall = getIsFirstInstall()

  if (isFirstInstall) {
    try {
      await init(args)
    } catch (err) {
      throw new Error(`Failed to initialize docz : ${err.message}`)
    }
  }

  try {
    await bundler.build()
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}
