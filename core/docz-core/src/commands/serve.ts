import { Arguments } from 'yargs'
import spawn from 'cross-spawn'
import sh from 'shelljs'

import * as paths from '../config/paths'
import { parseConfig } from '../config/docz'

export const serve = async (args: Arguments<any>) => {
  const config = await parseConfig(args)
  const cliArgs = ['serve']

  if (typeof config.base === 'string' && config.base.length) {
    // Append gatsby option `prefixPaths`to CLI args
    // https://www.gatsbyjs.org/docs/path-prefix/
    cliArgs.push('--prefixPaths')
    cliArgs.push(config.base)
  }

  sh.cd(paths.docz)
  spawn.sync('yarn', cliArgs, { stdio: 'inherit' })
}
