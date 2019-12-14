import sh from 'shelljs'

import * as paths from '../config/paths'
import { spawnSync } from '../utils/spawn'

export const serve = async () => {
  const cliArgs = ['run', 'serve']
  sh.cd(paths.docz)
  spawnSync('npm', cliArgs)
}
