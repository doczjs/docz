import { join, relative } from 'path'
import chokidar from 'chokidar'
import fastglob from 'fast-glob'
import { State, Params } from '../lib/DataServer'
import { get, propEq } from 'lodash/fp'

import * as paths from '../config/paths'
import { Config } from '../config/argv'
import { docgen } from '../utils/docgen'

const getPattern = (config: Config) => {
  const { typescript: ts, ignore, src: source } = config
  const src = relative(paths.root, source)
  return ignore
    .map(entry => `!**/${entry}`)
    .concat([
      join(src, ts ? '**/*.{ts,tsx}' : '**/*.{js,jsx,mjs}'),
      '!**/node_modules',
      '!**/doczrc.js',
    ])
}

const removeFilepath = (items: any[], filepath: string) =>
  items.filter((item: any) => item.key !== filepath)

const initial = (config: Config, pattern: string[]) => async (p: Params) => {
  const { filterComponents } = config
  const files = await fastglob<string>(pattern, { cwd: paths.root })
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

export const state = (config: Config): State => {
  const pattern = getPattern(config)
  const ignored = config.watchIgnore || /(((^|[\/\\])\..+)|(node_modules))/
  const watcher = chokidar.watch(pattern, {
    cwd: paths.root,
    ignored,
    persistent: true,
  })

  watcher.setMaxListeners(Infinity)

  return {
    id: 'props',
    start: async params => {
      const addInitial = initial(config, pattern)
      await addInitial(params)
      watcher.on('change', change(params, config))
      watcher.on('unlink', remove(params))
    },
    close: () => {
      watcher.close()
    },
  }
}
