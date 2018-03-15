#!/usr/bin/env node

const { server } = require('../src/server')

require('yargs')
  .command(
    'start [files]',
    'initialize the playground server',
    yargs => {
      yargs.positional('files', {
        type: 'string',
        default: '**/*.doc.js',
        describe: 'files that you want to document',
      })
    },
    argv => server(argv)
  )
  .demandCommand()
  .help()
  .wrap(72)
  .epilog('for more information visit https://github.com/pedronauck/playgrodd')
  .showHelpOnFail(false, 'whoops, something went wrong! run with --help').argv
