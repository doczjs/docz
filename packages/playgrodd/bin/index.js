#!/usr/bin/env node

const yargs = require('yargs')
const { Server } = require('playgrodd-core')

yargs
  .command(
    'start [files]',
    'initialize the playground server',
    yargs => {
      yargs.positional('source', {
        alias: 'src',
        type: 'string',
        default: 'src/',
      })
      yargs.positional('files', {
        type: 'string',
        default: '**/*.(js|jsx)',
      })
      yargs.positional('port', {
        alias: 'p',
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
