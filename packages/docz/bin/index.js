#!/usr/bin/env node

const yargs = require('yargs')
const envDotProp = require('env-dot-prop')
const { args: defaultArgs } = require('docz-core')

const setEnv = val => {
  envDotProp.set('babel.env', val)
  envDotProp.set('node.env', val)
}

const execCommand = (cmd, args) => {
  require('docz-core').commands[cmd](args)
}

yargs
  .command('dev', 'initialize docz dev server', defaultArgs, args => {
    setEnv('development')
    execCommand('dev', args)
  })
  .command('build', 'build dir as static site', defaultArgs, args => {
    setEnv('production')
    execCommand('build', args)
  })
  .demandCommand()
  .help()
  .wrap(72)
  .epilog('for more information visit https://github.com/pedronauck/docz')
  .showHelpOnFail(false, 'whoops, something went wrong! run with --help').argv
