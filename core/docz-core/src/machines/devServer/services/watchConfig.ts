import * as path from 'path'
import sh from 'shelljs'

import { ServerMachineCtx as Context } from '../context'
import { configWatcher } from '../../../states/config'
import * as paths from '../../../config/paths'

export const watchConfig = (ctx: Context) => () => {
  const watcher = configWatcher(ctx.args)
  const copyDoczrc = () => sh.cp(ctx.doczrcFilepath, paths.docz)
  const deleteDoczrc = () => sh.rm(path.join(paths.docz, 'doczrc.js'))

  watcher
    .on('add', copyDoczrc)
    .on('change', copyDoczrc)
    .on('unlink', deleteDoczrc)

  return () => watcher.close()
}
