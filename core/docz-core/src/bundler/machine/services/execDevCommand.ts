import sh from 'shelljs'

import * as paths from '../../../config/paths'

export const execDevCommand = async () => {
  sh.cd(paths.docz)
  sh.exec('yarn dev')
}
