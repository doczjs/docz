import spawn from 'cross-spawn'
import waitOn from 'wait-on'
import get from 'lodash/get'
import path from 'path'
import { ServerMachineCtx } from '../context'
import { openBrowser } from '../../../utils/open-browser'
import * as paths from '../../../config/paths'

export const execDevCommand = async ({ args }: ServerMachineCtx) => {
  // For monorepos that install dependencies higher in the fs tree
  const repoRootPath = get(args, 'repoRootPath', '../')
  const gatsbyPath = path.join(
    paths.docz,
    repoRootPath,
    'node_modules/.bin/gatsby'
  )
  spawn(gatsbyPath, ['develop', '--port', `${args.port}`], {
    stdio: 'inherit',
    cwd: paths.docz,
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
