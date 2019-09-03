import * as path from 'path'
import * as fs from 'fs-extra'
import { assign, Event } from 'xstate'
import { assoc } from 'lodash/fp'
import glob from 'fast-glob'
import log from 'signale'
import sh from 'shelljs'

import * as paths from '../../config/paths'
import { ServerMachineCtx } from './context'

const ensureFile = (filename: string, toDelete?: string) => {
  const ghost = path.resolve(paths.docz, toDelete || filename)
  const original = path.resolve(paths.root, filename)
  if (fs.pathExistsSync(ghost) && !fs.pathExistsSync(original)) {
    fs.removeSync(ghost)
  }
}

export const ensureFiles = () => {
  const themeDirs = glob.sync('src/gatsby-theme-**', {
    cwd: paths.docz,
    onlyDirectories: true,
  })

  ensureFile('doczrc.js')
  ensureFile('gatsby-browser.js')
  ensureFile('gatsby-ssr.js')
  ensureFile('gatsby-node.js')
  ensureFile('gatsby-config.js', 'gatsby-config.custom.js')

  themeDirs.forEach(dir => ensureFile(dir))
}

export const getIsFirstInstall = () => {
  return !sh.test('-e', paths.docz)
}
export const getIsDoczRepo = () => {
  return sh.test('-e', path.join(paths.root, '../../core'))
}

export const assignFirstInstall = assign((ctx: ServerMachineCtx) => {
  const firstInstall = getIsFirstInstall()
  return assoc('firstInstall', firstInstall, ctx)
})

export const checkIsDoczRepo = assign((ctx: ServerMachineCtx) => {
  const isDoczRepo = getIsDoczRepo()
  return assoc('isDoczRepo', isDoczRepo, ctx)
})

export const logError = (ctx: ServerMachineCtx, ev: Event<any>) => {
  log.fatal(ev.data)
  sh.exit(0)
}
