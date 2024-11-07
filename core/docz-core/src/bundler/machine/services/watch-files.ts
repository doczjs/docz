import * as path from 'path'
import * as fs from 'fs-extra'

import { Config } from '../../../config/argv'
import * as paths from '../../../config/paths'
import { createWatcher } from '../../../states/config'
import { ServerMachineCtx as Context } from '../context'

/**
 * Maps a given relative 'filepath' from 'themesDir/...' to 'src/...'
 */
const replaceThemesDir = (filepath: string, args: Config) => {
  // Make the path to a given relative`filepath` relative to themesDir:
  const rawFilePath = path.relative(
    paths.getThemesDir(args),
    path.resolve(paths.root, filepath)
  )
  // => e.g. '/gatsby-theme-docz/**/index.tsx'

  // Prefix with 'src':
  return path.join('src', rawFilePath)
  // => 'src/gatsby-theme-docz/**/index.tsx'
}

const watchGatsbyThemeFiles = (args: Config) => {
  const watcher = createWatcher(
    path.join(args.themesDir, 'gatsby-theme-**/**/*'),
    args
  )
  const copy = (filepath: string) => {
    const src = path.resolve(paths.root, filepath)
    const dest = path.resolve(paths.docz, replaceThemesDir(filepath, args))
    fs.copySync(src, dest)
  }
  const remove = (filepath: string) => {
    fs.removeSync(path.resolve(paths.docz, filepath))
  }

  watcher
    .on('add', copy)
    .on('addDir', copy)
    .on('change', copy)
    .on('unlink', remove)
    .on('unlinkDir', remove)

  return () => watcher.close()
}

const createWatch =
  (args: Config) => (glob: any, src: string, custom?: boolean) => {
    const watcher = createWatcher(glob, args)
    const srcPath = path.join(paths.root, src)
    const destPath = path.join(
      paths.docz,
      custom ? src.replace('.js', '.custom.js') : src
    )

    const copyFile = () => fs.copySync(srcPath, destPath)
    const deleteFile = () => fs.removeSync(destPath)

    watcher.on('add', copyFile).on('change', copyFile).on('unlink', deleteFile)

    return () => watcher.close()
  }

const watchDoczRc = (args: Context['args']) => {
  const watcher = createWatcher(
    path.join(paths.root, args.config ? args.config : 'doczrc.js'),
    args
  )

  const copy = (filepath: string) => {
    const src = path.resolve(paths.root, filepath)
    const dest = path.resolve(paths.docz, 'doczrc.js')
    fs.copySync(src, dest)
  }

  const remove = () => {
    fs.removeSync(path.resolve(paths.docz, 'doczrc.js'))
  }

  watcher.on('add', copy).on('change', copy).on('unlink', remove)
  return () => watcher.close()
}

export const watchFiles =
  ({ args }: Context) =>
  () => {
    const watch = createWatch(args)
    const doczrc = watchDoczRc(args)
    const gatsbyBrowser = watch(paths.gatsbyBrowser, 'gatsby-browser.js')
    const gatsbyNode = watch(paths.gatsbyNode, 'gatsby-node.js')
    const gatsbySSR = watch(paths.gatsbySSR, 'gatsby-ssr.js')
    const gatsbyConfig = watch(paths.gatsbyConfig, 'gatsby-config.js', true)
    const themeFilesWatcher = watchGatsbyThemeFiles(args)

    return () => {
      doczrc()
      gatsbyConfig()
      gatsbyBrowser()
      gatsbyNode()
      gatsbySSR()
      themeFilesWatcher()
    }
  }
