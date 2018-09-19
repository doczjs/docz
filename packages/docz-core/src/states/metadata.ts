import * as path from 'path'
import chokidar from 'chokidar'
import equal from 'fast-deep-equal'
import { State, Params } from '../DataServer'
import { Config } from '../commands/args'
import * as paths from '../config/paths'
import { parseSourceFiles } from '../utils/jsdoc'

const update = (config: Config) => async (p: Params) => {
  const oldMeta = p.state.metadata
  const newMeta = {
    annotations: await parseSourceFiles(config)
  }
  if(newMeta && !equal(oldMeta, newMeta)) {
    p.setState('metadata', newMeta)
  }
}

export const state = (config: Config): State => {
  const src = path.relative(paths.root, config.src)
  const files = path.join(src, config.files)
  const watcher = chokidar.watch(files, {
    cwd: paths.root,
    ignored: /(^|[\/\\])\../,
    persistent: true,
  })

  return {
    init: update(config),
    update: async params => {
      const updateWithConfig = update(config)

      watcher.on('add', async () => updateWithConfig(params))
      watcher.on('change', async () => updateWithConfig(params))
      watcher.on('unlink', async () => updateWithConfig(params))

      return () => watcher.close()
    }
  }
}
