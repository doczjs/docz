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
        describe: 'source folder of your project',
      })
      yargs.positional('files', {
        type: 'string',
        default: '**/*.(js|jsx)',
        describe: 'files that you want to document',
      })
      yargs.positional('port', {
        alias: 'p',
        type: 'number',
        default: 3000,
        describe: 'server port that you app will run',
      })
      yargs.positional('theme', {
        type: 'string',
        default: 'playgrodd-theme-default',
        describe: 'path of your custom theme',
      })
      yargs.positional('bundler', {
        type: 'string',
        default: 'webpack',
        describe: 'the id of the bundler you want to use',
      })
    },
    argv => new Server(argv).start()
  )
  .demandCommand()
  .help()
  .wrap(72)
  .epilog('for more information visit https://github.com/pedronauck/playgrodd')
  .showHelpOnFail(false, 'whoops, something went wrong! run with --help').argv
