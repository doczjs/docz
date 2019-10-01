import spawn from 'cross-spawn'
import sh from 'shelljs'
import waitOn from 'wait-on'
import { ServerMachineCtx } from '../context'
import { openBrowser } from '../../../utils/open-browser'
import * as paths from '../../../config/paths'

export const execDevCommand = async ({ args }: ServerMachineCtx) => {
  sh.cd(paths.docz)
  spawn('npm', ['run', 'dev', '--', '--port', `${args.port}`], {
    stdio: 'inherit',
  })
  const url = `http://${args.host}:${args.port}`
  console.log()
  console.log('Building app')
  await waitOn({
    resources: [url],
    timeout: 30000,
  })
  console.log()
  console.log('App ready on ' + url)
  openBrowser(url)
}
