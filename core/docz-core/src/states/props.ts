import { join, relative } from 'path'
import chokidar from 'chokidar'
import fastglob from 'fast-glob'
import { State, Params } from '../lib/DataServer'
import { flatten, get } from 'lodash/fp'

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

export const mapToArray = (map: any = []) =>
  Object.entries(map)
    .map(entry => {
      return entry && { key: relative(paths.root, entry[0]), value: entry[1] }
    })
    .filter(Boolean)

const initial = (config: Config, pattern: string[]) => async (p: Params) => {
  const files = await fastglob<string>(pattern, { cwd: paths.root })
  const metadata = await docgen(files, config)
  p.setState('props', flatten(mapToArray(metadata)))
}

const add = (p: Params, config: Config) => async (filepath: string) => {
  const prev = get('props', p.getState())
  const metadata = mapToArray(await docgen([filepath], config))
  const keys = metadata.map(item => item.key)
  const filtered = prev.filter((item: any) => keys.indexOf(item.key) === -1)
  const next = flatten(filtered.concat([metadata]))
  p.setState('props', next)
}

const remove = (p: Params) => async (filepath: string) => {
  const prev = get('props', p.getState())
  const next = prev.filter((item: any) => item.key !== filepath)
  p.setState('props', next)
}

export const state = (config: Config): State => {
  const pattern = getPattern(config)
  const watcher = chokidar.watch(pattern, {
    cwd: paths.root,
    ignored: /(((^|[\/\\])\..+)|(node_modules))/,
    persistent: true,
  })

  watcher.setMaxListeners(Infinity)

  return {
    id: 'props',
    start: async params => {
      const addInitial = initial(config, pattern)
      await addInitial(params)
      watcher.on('change', add(params, config))
      watcher.on('unlink', remove(params))
    },
    close: () => {
      watcher.close()
    },
  }
}
