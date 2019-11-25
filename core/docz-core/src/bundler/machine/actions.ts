import * as path from 'path'
import * as fs from 'fs-extra'
import { assign, Event } from 'xstate'
import { assoc } from 'lodash/fp'
import glob from 'fast-glob'
import log from 'signale'
import sh from 'shelljs'

import * as paths from '../../config/paths'
import { ServerMachineCtx } from './context'
import { copyDoczRc } from './services/create-resources'

const ensureFile = (filename: string, toDelete?: string) => {
  const ghost = path.resolve(paths.docz, toDelete || filename)
  const original = path.resolve(paths.root, filename)
  if (fs.pathExistsSync(ghost) && !fs.pathExistsSync(original)) {
    fs.removeSync(ghost)
  }
}

export const ensureFiles = ({ args }: ServerMachineCtx) => {
  const appPath = path.join(paths.root, args.themesDir)
  const themeNames = glob.sync('gatsby-theme-**', {
    cwd: appPath,
    onlyDirectories: true,
  })
  themeNames.forEach(themeName => {
    fs.copySync(
      path.join(appPath, themeName),
      path.join(paths.docz, 'src', themeName)
    )
  })
  copyDoczRc(args.config)
  ensureFile('gatsby-browser.js')
  ensureFile('gatsby-ssr.js')
  ensureFile('gatsby-node.js')
  ensureFile('gatsby-config.js', 'gatsby-config.custom.js')

  const publicPath = path.join(paths.docz, '..', args.public)
  if (fs.existsSync(publicPath)) {
    const destinationPath = path.join(paths.docz, 'static', args.public)
    try {
      fs.copySync(publicPath, destinationPath)
    } catch (err) {
      console.log(
        `Failed to copy static assets from ${publicPath} to ${destinationPath} : ${err.message}`
      )
    }
  }
}

export const getIsFirstInstall = () => {
  return !sh.test('-e', path.join(paths.docz, 'package.json'))
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
