#!/usr/bin/env node

const yargs = require('yargs')
const { commands } = require('docz-core')

yargs
  .command(
    'dev [files]',
    'initialize docz dev server',
    commands.args,
    commands.dev
  )
  .demandCommand()
  .help()
  .wrap(72)
  .epilog('for more information visit https://github.com/pedronauck/docz')
  .showHelpOnFail(false, 'whoops, something went wrong! run with --help').argv
