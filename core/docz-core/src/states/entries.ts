import * as path from 'path'
import chokidar from 'chokidar'
import equal from 'fast-deep-equal'
import { touch, compiled } from 'docz-utils/lib/fs'

import { Params, State } from '../lib/DataServer'
import { Entries, EntryMap, fromTemplates } from '../lib/Entries'
import { Config } from '../config/argv'
import * as paths from '../config/paths'

const writeImports = async (map: EntryMap): Promise<void> => {
  const imports = await compiled(fromTemplates('imports.tpl.js'))
  const rawImportsJs = imports({ entries: Object.values(map) })

  await touch(path.join(paths.app, 'imports.js'), rawImportsJs)
}

const updateEntries = (entries: Entries) => async (p: Params) => {
  const old = p.state.entries
  const map = await entries.get()

  if (map && !equal(old, map)) {
    await writeImports(map)
    p.setState('entries', map)
  }
}

export const state = (entries: Entries, config: Config): State => {
  const src = path.relative(paths.root, config.src)
  const files = path.join(src, config.files)
  const watcher = chokidar.watch(files, {
    cwd: paths.root,
    ignored: /(((^|[\/\\])\..+)|(node_modules))/,
    persistent: true,
  })

  watcher.setMaxListeners(Infinity)

  return {
    id: 'entries',
    init: updateEntries(entries),
    close: () => watcher.close(),
    update: async params => {
      const update = updateEntries(entries)

      watcher.on('change', async () => update(params))
      watcher.on('unlink', async () => update(params))
      watcher.on('raw', async (event: string, path: string, details: any) => {
        if (details.event === 'moved' && details.type === 'directory') {
          await update(params)
        }
      })

      return () => watcher.close()
    },
  }
}
