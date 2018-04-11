#!/usr/bin/env node

const yargs = require('yargs')
const { Server } = require('playgrodd-core')

yargs
  .command(
    'start [files]',
    'initialize the playground server',
    yargs => {
      yargs.positional('files', {
        type: 'string',
        default: '**/*.(js|jsx)',
        describe: 'files that you want to document',
      })
      yargs.positional('port', {
        type: 'number',
        default: 3000,
      })
      yargs.positional('theme', {
        type: 'string',
        default: 'playgrodd-theme-default',
      })
      yargs.positional('bundler', {
        type: 'string',
        default: 'webpack',
      })
    },
    argv => new Server(argv).start()
  )
  .demandCommand()
  .help()
  .wrap(72)
  .epilog('for more information visit https://github.com/pedronauck/playgrodd')
  .showHelpOnFail(false, 'whoops, something went wrong! run with --help').argv
