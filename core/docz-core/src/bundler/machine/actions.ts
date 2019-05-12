import * as path from 'path'
import { assign, Event } from 'xstate'
import { assoc } from 'lodash/fp'
import log from 'signale'
import sh from 'shelljs'

import * as paths from '../../config/paths'
import { ServerMachineCtx } from './context'

export const assignFirstInstall = assign((ctx: ServerMachineCtx) => {
  const firstInstall = !sh.test('-e', paths.docz)
  return assoc('firstInstall', firstInstall, ctx)
})

export const copyLocalPackages = async ({ firstInstall }: ServerMachineCtx) => {
  if (!firstInstall) return
  const isDoczRepo = sh.test('-e', path.join(paths.root, '../../core'))
  const relativeTo = isDoczRepo ? '../../' : './'
  const appNodeModules = path.join(paths.root, relativeTo, 'node_modules')
  const nodeModules = path.join(paths.docz, 'node_modules')
  sh.cp('-RL', appNodeModules, nodeModules)
}

export const logServerInfo = (ctx: ServerMachineCtx) => {
  log.success(`Your app is up and running on localhost:${ctx.args.port}`)
}

export const logError = (ctx: ServerMachineCtx, ev: Event<any>) => {
  log.fatal(ev.data)
  sh.exit(0)
}
