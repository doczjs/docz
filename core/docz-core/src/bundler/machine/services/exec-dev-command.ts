import spawn from 'cross-spawn'
import waitOn from 'wait-on'
import get from 'lodash/get'
import path from 'path'
import findUp from 'find-up'

import { ServerMachineCtx } from '../context'
import { openBrowser } from '../../../utils/open-browser'
import * as paths from '../../../config/paths'

export const findRootPath = async () => {
  let repoRootPath = path.join(paths.docz, '../')
  try {
    const foundRootPath = await findUp(
      async directory => {
        const hasGatsby = await findUp.exists(
          path.join(directory, 'node_modules', 'gatsby')
        )
        return hasGatsby ? directory : ''
      },
      { type: 'directory' }
    )
    if (typeof foundRootPath === 'string') {
      repoRootPath = foundRootPath
    }
  } catch (err) {
    console.log(
      `Failed to find root folder ${err.message} \n Assuming it is ${repoRootPath}`
    )
  }
  return repoRootPath
}

export const execDevCommand = async ({ args }: ServerMachineCtx) => {
  // For monorepos that install dependencies higher in the fs tree
  const repoRootPath = get(args, 'repoRootPath', await findRootPath())
  const gatsbyPath = path.join(repoRootPath, 'node_modules/.bin/gatsby')
  // const cliArgs = process.argv.slice(3)

  // Has --https flag to enable https in dev mode
  const useHttps = args.https
  const caFile = args.caFile
  const keyFile = args.keyFile
  const certFile = args.certFile
  const caFileOption = caFile ? ['--ca-file', caFile] : []
  const keyFileOption = keyFile ? ['--key-file', keyFile] : []
  const certFileOption = certFile ? ['--cert-file', certFile] : []

  spawn(
    gatsbyPath,
    [
      'develop',
      '--host',
      `${args.host}`,
      '--port',
      `${args.port}`,
      useHttps ? '--https' : '',
      ...caFileOption,
      ...keyFileOption,
      ...certFileOption,
    ],
    {
      stdio: 'inherit',
      cwd: paths.docz,
    }
  )
  const protocol = useHttps ? 'https' : 'http'
  const url = `${protocol}://${args.host}:${args.port}`
  console.log()
  console.log('Building app')
  await waitOn({
    resources: [url],
    timeout: 30000,
  })
  console.log()
  console.log('App ready on ' + url)
  if (args.open !== null && Boolean(args.open) === false) {
    return
  }
  openBrowser(url)
}
