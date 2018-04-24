#!/usr/bin/env node

const yargs = require('yargs')
const { Server, createArgs } = require('docz-bundler')

yargs
  .command('dev [files]', 'initialize docz dev server', createArgs, argv =>
    new Server(argv).start()
  )
  .demandCommand()
  .help()
  .wrap(72)
  .epilog('for more information visit https://github.com/pedronauck/docz')
  .showHelpOnFail(false, 'whoops, something went wrong! run with --help').argv
