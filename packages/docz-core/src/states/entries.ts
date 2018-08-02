import * as path from 'path'
import chokidar from 'chokidar'

import { Params, State } from '../DataServer'
import { Entries, EntryMap, fromTemplates } from '../Entries'
import { Config } from '../commands/args'
import { touch, compiled } from '../utils/fs'
import * as paths from '../config/paths'

const writeImports = async (map: EntryMap): Promise<void> => {
  const imports = await compiled(fromTemplates('imports.tpl.js'))
  const rawImportsJs = imports({ entries: Object.values(map) })

  await touch(path.join(paths.app, 'imports.js'), rawImportsJs)
}

const updateEntries = (entries: Entries) => async (p: Params) => {
  const map = await entries.get()

  await writeImports(map)
  p.setState('entries', map)
}

export const state = (config: Config): State => {
  const entries = new Entries(config)
  const watcher = chokidar.watch(config.files, {
    ignored: /(^|[\/\\])\../,
  })

  return {
    init: updateEntries(entries),
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
