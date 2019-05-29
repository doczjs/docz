import chokidar from 'chokidar'
import equal from 'fast-deep-equal'
import { get } from 'lodash/fp'

import { WATCH_IGNORE } from './config'
import { Params, State } from '../lib/DataServer'
import { Entries, getFilesToMatch } from '../lib/Entries'
import { Config } from '../config/argv'
import * as paths from '../config/paths'

const mapToArray = (map: any = []) =>
  Object.entries(map)
    .map(entry => entry && { key: entry[0], value: entry[1] })
    .filter(Boolean)

const updateEntries = (entries: Entries) => async (p: Params) => {
  const prev = get('entries', p.getState())
  const map = await entries.get()

  if (map && !equal(prev, map)) {
    p.setState('entries', mapToArray(map))
  }
}

export const state = (
  entries: Entries,
  config: Config,
  dev?: boolean
): State => {
  const ignored = config.watchIgnore || WATCH_IGNORE
  const watcher = chokidar.watch(getFilesToMatch(config), {
    ignored,
    persistent: true,
    cwd: paths.getRootDir(config),
  })

  watcher.setMaxListeners(Infinity)

  return {
    id: 'entries',
    start: async params => {
      const update = updateEntries(entries)
      await update(params)

      if (dev) {
        watcher.on('add', async () => update(params))
        watcher.on('change', async () => update(params))
        watcher.on('unlink', async () => update(params))
        watcher.on('raw', async (event: string, path: string, details: any) => {
          if (details.event === 'moved' && details.type === 'directory') {
            await update(params)
          }
        })
      }
    },
    close: () => {
      watcher.close()
    },
  }
}
