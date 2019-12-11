import * as fs from 'fs-extra'
import * as path from 'path'
import spawn from 'cross-spawn'
import sh from 'shelljs'

import * as paths from '../config/paths'
import { BuildFn } from '../lib/Bundler'
import { ensureFiles } from './machine/actions'

export const build: BuildFn = async (config, dist) => {
  const publicDir = path.join(paths.docz, 'public')
  const cliArgs = ['run', 'build']

  if (typeof config.base === 'string' && config.base.length) {
    cliArgs.push('--')
    // Append gatsby option `--prefix-paths`to CLI args which will prepend pathPrefix from gatsby-config to urls
    // https://www.gatsbyjs.org/docs/path-prefix/
    cliArgs.push('--prefix-paths')
  }
  ensureFiles({ args: config })
  sh.cd(paths.docz)
  spawn.sync('npm', cliArgs, { stdio: 'inherit' })
  await fs.copy(publicDir, dist)
}
