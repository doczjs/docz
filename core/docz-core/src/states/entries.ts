import * as path from 'path'
import chokidar from 'chokidar'
import equal from 'fast-deep-equal'
import { get } from 'lodash/fp'

import { mapToArray } from './props'
import { Params, State } from '../lib/DataServer'
import { Entries } from '../lib/Entries'
import { Config } from '../config/argv'
import * as paths from '../config/paths'

const updateEntries = (entries: Entries) => async (p: Params) => {
  const prev = get('entries', p.getState())
  const map = await entries.get()

  if (map && !equal(prev, map)) {
    await Entries.writeImports(map)
    p.setState('entries', mapToArray(map))
  }
}

export const state = (entries: Entries, config: Config): State => {
  const src = path.relative(paths.root, config.src)
  const files = Array.isArray(config.files)
    ? config.files.map(filePath => path.join(src, filePath))
    : path.join(src, config.files)

  const watcher = chokidar.watch(files, {
    cwd: paths.root,
    ignored: /(((^|[\/\\])\..+)|(node_modules))/,
    persistent: true,
  })

  watcher.setMaxListeners(Infinity)

  return {
    id: 'entries',
    start: async params => {
      const update = updateEntries(entries)

      update(params);
      watcher.on('add', async () => update(params))
      watcher.on('change', async () => update(params))
      watcher.on('unlink', async () => update(params))
      watcher.on('raw', async (event: string, path: string, details: any) => {
        if (details.event === 'moved' && details.type === 'directory') {
          await update(params)
        }
      })
    },
    close: () => {
      watcher.close()
    },
  }
}
