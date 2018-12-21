import chokidar from 'chokidar'
import equal from 'fast-deep-equal'
import fastglob from 'fast-glob'
import { State, Params } from '../DataServer'
import { get, omit } from 'lodash/fp'

import * as paths from '../config/paths'
import { Config } from '../commands/args'
import { docgen } from '../utils/docgen'

const getPattern = (ts: boolean) => {
  const tsPattern = '**/*.{ts,tsx}'
  const jsPattern = '**/*.{js,jsx,mjs}'
  return [ts ? tsPattern : jsPattern, '!**/node_modules']
}

const initial = (config: Config) => async (p: Params) => {
  const pattern = getPattern(config.typescript)
  const files = await fastglob<string>(pattern, { cwd: paths.root })
  const metadata = await docgen(files, config)
  p.setState('props', metadata)
}

const add = (config: Config) => (p: Params) => async (filepath: string) => {
  const old = get('state.props', p)
  const metadata = await docgen([filepath], config)

  if (metadata && !equal(old, metadata)) {
    p.setState('props', {
      ...old,
      ...metadata,
    })
  }
}

const remove = (config: Config) => (p: Params) => async (filepath: string) =>
  p.setState('props', omit(filepath, get('state.props', p)))

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
    init: initial(config),
    close: () => watcher.close(),
    update: async params => {
      const addFilepath = add(config)
      const removeFilepath = remove(config)

      watcher.on('add', addFilepath(params))
      watcher.on('change', addFilepath(params))
      watcher.on('unlink', removeFilepath(params))

      return () => watcher.close()
    },
  }
}
