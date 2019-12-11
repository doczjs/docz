import spawn from 'cross-spawn'
import sh from 'shelljs'

import * as paths from '../config/paths'

export const serve = async () => {
  const cliArgs = ['run', 'serve']
  sh.cd(paths.docz)
  spawn.sync('npm', cliArgs, { stdio: 'inherit' })
}
