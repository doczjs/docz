import * as path from 'path'
import chokidar from 'chokidar'
import fastglob from 'fast-glob'
import { State, Params } from '../lib/DataServer'
import { get, propEq } from 'lodash/fp'

import * as paths from '../config/paths'
import { Config } from '../config/argv'
import { docgen, unixPath } from '../utils/docgen'
import { WATCH_IGNORE } from './config'

export const getPattern = (config: Config) => {
  const {
    ignore,
    src: source,
    typescript: ts,
    docgenConfig: docgenConfig,
  } = config

  if (docgenConfig.searchPatterns) {
    return docgenConfig.searchPatterns
  }

  const searchPath = docgenConfig.searchPath ? docgenConfig.searchPath : source
  const root = paths.getRootDir(config)
  const srcDir = path.resolve(root, searchPath)
  const src = path.relative(root, srcDir)
  const filesPattern = path.join(
    src,
    ts ? '**/*.{ts,tsx,js,jsx,mjs}' : '**/*.{js,jsx,mjs}'
  )

  return ignore
    .map(entry => typeof entry === 'string' && `!**/${entry}`)
    .filter(Boolean)
    .concat([
      unixPath(filesPattern),
      '!**/node_modules',
      '!**/doczrc.js',
    ]) as string[]
}

const removeFilepath = (items: any[], filepath: string) =>
  items.filter((item: any) => item.key !== filepath)

export const initial =
  (config: Config, pattern: string[]) => async (p: Params) => {
    const { filterComponents } = config
    const cwd = paths.getRootDir(config)
    const files = await fastglob(pattern, { cwd, caseSensitiveMatch: false })
    const filtered = filterComponents ? filterComponents(files) : files
    const metadata = await docgen(filtered, config)
    p.setState('props', metadata)
  }

const change = (p: Params, config: Config) => async (filepath: string) => {
  const prev = get('props', p.getState())
  const metadata = await docgen([filepath], config)
  const filtered = metadata.filter(propEq('key', filepath))
  const next = removeFilepath(prev, filepath).concat(filtered)
  p.setState('props', next)
}

const remove = (p: Params) => async (filepath: string) => {
  const prev = get('props', p.getState())
  const next = removeFilepath(prev, filepath)
  p.setState('props', next)
}

export const state = (config: Config, dev?: boolean): State => {
  const pattern = getPattern(config)
  const ignored = config.watchIgnore || WATCH_IGNORE
  const cwd = paths.getRootDir(config)
  const watcher = chokidar.watch(pattern, {
    cwd,
    ignored,
    persistent: true,
  })

  watcher.setMaxListeners(Infinity)

  return {
    id: 'props',
    start: async params => {
      const addInitial = initial(config, pattern)
      await addInitial(params)

      if (dev) {
        watcher.on('change', change(params, config))
        watcher.on('unlink', remove(params))
      }
    },
    close: () => {
      watcher.close()
    },
  }
}
