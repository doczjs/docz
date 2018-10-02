import * as path from 'path'
import chokidar from 'chokidar'
import equal from 'fast-deep-equal'
import { State, Params } from '../DataServer'
import get from 'lodash.get'

import * as paths from '../config/paths'
import { Entries } from '../Entries'
import { Config } from '../commands/args'
import { parseSourceFiles, jsdocParse } from '../utils/jsdoc'

const initial = (entries: Entries, config: Config) => async (p: Params) => {
  const annotations = await parseSourceFiles(entries, config)
  p.setState('metadata', { annotations })
}

const update = (config: Config) => (p: Params) => async (filepath: string) => {
  const old = get(p, 'state.metadata.annotations')
  const fullpath = path.join(paths.root, config.src, filepath)
  const newMeta = { ...old, [fullpath]: jsdocParse(fullpath) }

  if (newMeta && !equal(old, newMeta)) {
    p.setState('metadata', { annotations: newMeta })
  }
}

export const state = (entries: Entries, config: Config): State => {
  const src = path.relative(paths.root, config.src)
  const files = path.join(src, '**/*.{js,jsx,ts,tsx,mjs}')
  const watcher = chokidar.watch(files, {
    cwd: paths.root,
    ignored: /(((^|[\/\\])\..+)|(node_modules))/,
    persistent: true,
  })

  return {
    init: initial(entries, config),
    close: watcher.close,
    update: async params => {
      const updateWithConfig = update(config)

      watcher.on('add', updateWithConfig(params))
      watcher.on('change', updateWithConfig(params))
      watcher.on('unlink', updateWithConfig(params))

      return watcher.close
    },
  }
}
