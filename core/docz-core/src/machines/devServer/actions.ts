import * as path from 'path'
import { assign, Event } from 'xstate'
import { get, assoc } from 'lodash/fp'
import log from 'signale'
import sh from 'shelljs'

import * as paths from '../../config/paths'
import { openBrowser as open } from '../../utils/open-browser'
import { ServerMachineCtx } from './context'

export const assignFirstInstall = assign((ctx: ServerMachineCtx) => {
  const firstInstall = !sh.test('-e', paths.docz)
  return assoc('firstInstall', firstInstall, ctx)
})

export const checkIsDoczRepo = assign((ctx: ServerMachineCtx) => {
  const isDoczRepo = sh.test('-e', path.join(paths.root, '../../core'))
  return assoc('isDoczRepo', isDoczRepo, ctx)
})

export const openBrowser = ({ args }: ServerMachineCtx) => {
  if (get('openBrowser', args) || get('o', args)) {
    open(`http://${args.host}:${args.port}`)
  }
}

export const logError = (ctx: ServerMachineCtx, ev: Event<any>) => {
  log.fatal(ev.data)
  sh.exit(0)
}
