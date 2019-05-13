import spawn from 'cross-spawn'
import sh from 'shelljs'

import * as paths from '../../../config/paths'

export const execDevCommand = async () => {
  sh.cd(paths.docz)
  return spawn('yarn', ['dev'], { stdio: 'inherit' })
}
