import * as fs from 'fs-extra'
import { load, finds } from 'load-cfg'
import chokidar from 'chokidar'
import equal from 'fast-deep-equal'
import get from 'lodash.get'

import { Params, State } from '../DataServer'
import { Config, RootMenuConfig, ThemeConfig } from '../commands/args'
import { getRepoUrl } from '../utils/repo-info'
import * as paths from '../config/paths'

interface Payload {
  title: string
  description: string
  ordering: string
  menu: RootMenuConfig
  themeConfig: ThemeConfig
  version: string | null
  repository: string | null
}

const getInitialConfig = (config: Config): Payload => {
  const pkg = fs.readJsonSync(paths.appPackageJson, { throws: false })
  const repoUrl = getRepoUrl()

  return {
    title: config.title,
    description: config.description,
    themeConfig: config.themeConfig,
    menu: config.menu,
    ordering: config.ordering,
    version: get(pkg, 'version'),
    repository: repoUrl,
  }
}

const updateConfig = (config: Config) => async (p: Params) => {
  const old = p.state.config
  const newConfig = load('docz', getInitialConfig(config), true)

  if (newConfig && !equal(old, newConfig)) {
    p.setState('config', newConfig)
  }
}

export const state = (config: Config): State => ({
  init: updateConfig(config),
  update: async params => {
    const update = updateConfig(config)
    const watcher = chokidar.watch(finds('docz'), {
      cwd: paths.root,
      persistent: true,
    })

    watcher.on('add', async () => update(params))
    watcher.on('change', async () => update(params))
    watcher.on('unlink', async () => update(params))

    return () => watcher.close()
  },
})
