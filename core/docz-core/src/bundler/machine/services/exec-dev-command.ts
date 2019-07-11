import spawn from 'cross-spawn'
import sh from 'shelljs'

import { ServerMachineCtx } from '../context'
import { openBrowser } from '../../../utils/open-browser'
import * as paths from '../../../config/paths'

export const execDevCommand = async ({ args }: ServerMachineCtx) => {
  sh.cd(paths.docz)
  spawn('yarn', ['dev', '--port', `${args.port}`], { stdio: 'inherit' })
  openBrowser(`http://${args.host}:${args.port}`)
}
