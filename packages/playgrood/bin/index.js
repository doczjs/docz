#!/usr/bin/env node

const yargs = require('yargs')
const { server } = require('../build/main/server')

yargs
  .command(
    'start [files]',
    'initialize the playground server',
    yargs => {
      yargs.positional('files', {
        type: 'string',
        default: '**/*.doc.(js|jsx)',
        describe: 'files that you want to document',
      })
    },
    server
  )
  .demandCommand()
  .help()
  .wrap(72)
  .epilog('for more information visit https://github.com/pedronauck/playgrodd')
  .showHelpOnFail(false, 'whoops, something went wrong! run with --help').argv
