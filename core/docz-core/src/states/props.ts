import { relative } from 'path'
import chokidar from 'chokidar'
import fastglob from 'fast-glob'
import { State, Params } from '../lib/DataServer'
import { flatten, get } from 'lodash/fp'
import { Signale } from 'signale'

import * as paths from '../config/paths'
import { Config } from '../config/argv'
import { docgen } from '../utils/docgen'

const getPattern = (ts: boolean) => {
  const tsPattern = '**/*.{ts,tsx}'
  const jsPattern = '**/*.{js,jsx,mjs}'
  return [ts ? tsPattern : jsPattern, '!**/node_modules']
}

export const mapToArray = (map: any) =>
  Object.entries(map).map(([key, value]) => ({ key, value }))

const initial = (config: Config) => async (p: Params) => {
  const pattern = getPattern(config.typescript)
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
  const root = paths.root
  const prev = get('props', p.getState())
  const next = prev.filter((item: any) => relative(root, item.key) !== filepath)
  p.setState('props', next)
}

export const state = (config: Config): State => {
  const pattern = getPattern(config.typescript)
  const watcher = chokidar.watch(pattern, {
    cwd: paths.root,
    ignored: /(((^|[\/\\])\..+)|(node_modules))/,
    persistent: true,
  })

  watcher.setMaxListeners(Infinity)

  return {
    id: 'props',
    start: async params => {
      const interactive = new Signale({ interactive: true, scope: 'props' })
      interactive.await(
        'Parsing initial props from your components (this could take a while)'
      )
      const addInitial = initial(config)
      await addInitial(params)
      interactive.success('Props parsed successfuly')

      watcher.on('change', add(params, config))
      watcher.on('unlink', remove(params))
    },
    close: () => {
      watcher.close()
    },
  }
}
