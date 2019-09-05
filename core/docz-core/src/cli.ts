import * as yargs from 'yargs'

import { setArgs } from './config/argv'
import { setEnv } from './config/env'
import * as commands from './commands'

export const cli = () => {
  return yargs
    .command('init', 'initialize docz in your app', setArgs, async args => {
      setEnv('development')
      await commands.init(args)
    })
    .command('dev', 'initialize docz dev server', setArgs, async args => {
      setEnv('development')
      await commands.dev(args)
    })
    .command('build', 'build dir as static site', setArgs, async args => {
      setEnv('production')
      await commands.build(args)
      process.exit()
    })
    .command('serve', 'serve dir as static site', setArgs, async args => {
      setEnv('production')
      await commands.serve(args)
      process.exit()
    })
    .demandCommand()
    .help()
    .wrap(72)
    .epilog('for more information visit https://github.com/doczjs/docz')
    .showHelpOnFail(false, 'whoops, something went wrong! run with --help').argv
}
