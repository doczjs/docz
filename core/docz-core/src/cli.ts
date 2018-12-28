import yargs from 'yargs'

import { setArgs } from './config/argv'
import { setEnv } from './config/env'
import * as commands from './commands'

export const cli = () => {
  return yargs
    .command('dev', 'initialize docz dev server', setArgs, async args => {
      setEnv('development')
      await commands.dev(args)
    })
    .command('build', 'build dir as static site', setArgs, async args => {
      setEnv('build')
      await commands.build(args)
      process.exit()
    })
    .demandCommand()
    .help()
    .wrap(72)
    .epilog('for more information visit https://github.com/pedronauck/docz')
    .showHelpOnFail(false, 'whoops, something went wrong! run with --help').argv
}
