import * as path from 'path'
import { finds } from 'load-cfg'
import sh from 'shelljs'

import { Config } from '../../../config/argv'
import * as paths from '../../../config/paths'
import { createWatcher } from '../../../states/config'
import { ServerMachineCtx as Context } from '../context'

const createWatch = (args: Config) => (
  glob: any,
  src: string,
  custom?: boolean
) => {
  const watcher = createWatcher(glob, args)
  const srcPath = path.join(paths.root, src)
  const destPath = path.join(
    paths.docz,
    custom ? src.replace('.js', '.custom.js') : src
  )

  const copyFile = () => sh.cp(srcPath, destPath)
  const deleteFile = () => sh.rm(destPath)

  watcher
    .on('add', copyFile)
    .on('change', copyFile)
    .on('unlink', deleteFile)

  return () => watcher.close()
}

export const watchConfigFiles = ({ args }: Context) => () => {
  const watch = createWatch(args)
  const doczrc = watch(args.config || finds('docz'), 'doczrc.js')
  const gatsbyBrowser = watch(paths.gatsbyBrowser, 'gatsby-browser.js')
  const gatsbyNode = watch(paths.gatsbyNode, 'gatsby-node.js')
  const gatsbySSR = watch(paths.gatsbySSR, 'gatsby-ssr.js')
  const gatsbyConfig = watch(paths.gatsbyConfig, 'gatsby-config.js', true)

  return () => {
    doczrc()
    gatsbyConfig()
    gatsbyBrowser()
    gatsbyNode()
    gatsbySSR()
  }
}
