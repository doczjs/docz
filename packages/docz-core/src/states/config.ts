import * as fs from 'fs-extra'
import { load, finds } from 'load-cfg'
import chokidar from 'chokidar'
import get from 'lodash.get'

import { Params, State } from '../DataServer'
import { Config, ThemeConfig } from '../commands/args'
import * as paths from '../config/paths'

interface Payload {
  title: string
  description: string
  ordering: string
  themeConfig: ThemeConfig
  version: string | null
}

const getInitialConfig = (config: Config): Payload => {
  const pkg = fs.readJsonSync(paths.appPackageJson, { throws: false })

  return {
    title: config.title,
    description: config.description,
    themeConfig: config.themeConfig,
    ordering: config.ordering,
    version: get(pkg, 'version'),
  }
}

const updateConfig = (config: Config) => async (p: Params) =>
  p.setState('config', load('docz', getInitialConfig(config), true))

export const state = (config: Config): State => ({
  init: updateConfig(config),
  update: async params => {
    const watcher = chokidar.watch(finds('docz'))
    const update = updateConfig(config)

    watcher.on('add', async () => update(params))
    watcher.on('change', async () => update(params))
    watcher.on('unlink', async () => update(params))

    return () => watcher.close()
  },
})
