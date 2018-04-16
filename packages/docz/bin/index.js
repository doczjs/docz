#!/usr/bin/env node

const yargs = require('yargs')
const { Server } = require('docz-core')

const exts = '{j,t}{s,sx}'
const defaultFilesGlob = [
  `docs/**.${exts}`,
  `**/__docs__/*.${exts}`,
  `**/*.doc.${exts}`,
]

yargs
  .command(
    'start [files]',
    'initialize docz server',
    yargs => {
      yargs.positional('source', {
        alias: 'src',
        type: 'string',
        default: 'src/',
      })
      yargs.positional('files', {
        type: 'string',
        default: defaultFilesGlob,
      })
      yargs.positional('port', {
        alias: 'p',
        type: 'number',
        default: 3000,
      })
      yargs.positional('theme', {
        type: 'string',
        default: 'docz-theme-default',
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
  .epilog('for more information visit https://github.com/pedronauck/docz')
  .showHelpOnFail(false, 'whoops, something went wrong! run with --help').argv
