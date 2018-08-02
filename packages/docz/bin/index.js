#!/usr/bin/env node

const yargs = require('yargs')
const { args: defaultArgs, setEnv } = require('docz-core')

const execCommand = cmd => async args =>
  require('docz-core').commands[cmd](args)

yargs
  .command(
    'dev',
    'initialize docz dev server',
    defaultArgs('development'),
    execCommand('dev')
  )
  .command(
    'build',
    'build dir as static site',
    defaultArgs('production'),
    async args => {
      await execCommand('build')(args)
      process.exit()
    }
  )
  .demandCommand()
  .help()
  .wrap(72)
  .epilog('for more information visit https://github.com/pedronauck/docz')
  .showHelpOnFail(false, 'whoops, something went wrong! run with --help').argv
