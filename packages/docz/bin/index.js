#!/usr/bin/env node

const yargs = require('yargs')
const { Server } = require('../dist/index.umd')

const EXTS = '{j,t}{s,sx}'
const DEFAULT_FILES_GLOB = [
  `docs/**.${EXTS}`,
  `**/__docs__/*.${EXTS}`,
  `**/*.doc.${EXTS}`,
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
        default: DEFAULT_FILES_GLOB,
      })
      yargs.positional('type', {
        type: 'string',
        default: 'react',
      })
      yargs.positional('bundler', {
        type: 'string',
        default: 'webpack',
      })
      yargs.positional('title', {
        type: 'string',
        default: 'Docz',
      })
      yargs.positional('description', {
        type: 'string',
        default: 'My awesome design system!',
      })
      yargs.positional('theme', {
        type: 'string',
        default: 'docz-theme-default',
      })
      yargs.positional('env', {
        type: 'boolean',
        default: process.env.NODE_ENV || 'development',
      })
      yargs.positional('debug', {
        type: 'boolean',
        default: process.env.DEBUG || false,
      })
      yargs.positional('protocol', {
        type: 'string',
        default: process.env.HTTPS === 'true' ? 'https' : 'http',
      })
      yargs.positional('host', {
        type: 'string',
        default: process.env.HOST || '0.0.0.0',
      })
      yargs.positional('port', {
        alias: 'p',
        type: 'number',
        default: process.env.PORT || 3000,
      })
    },
    argv => new Server(argv).start()
  )
  .demandCommand()
  .help()
  .wrap(72)
  .epilog('for more information visit https://github.com/pedronauck/docz')
  .showHelpOnFail(false, 'whoops, something went wrong! run with --help').argv
