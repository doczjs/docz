import * as fs from 'fs-extra'
import { load, finds } from 'load-cfg'
import chokidar from 'chokidar'
import get from 'lodash/get'

import * as paths from '../config/paths'
import { Params, State } from '../DataServer'
import { Config, Menu, ThemeConfig } from '../commands/args'
import { getRepoUrl } from '../utils/repo-info'

interface Payload {
  title: string
  description: string
  ordering: string
  menu: Menu[]
  version: string | null
  repository: string | null
  native: boolean
  codeSandbox: boolean
  themeConfig: ThemeConfig
}

const getInitialConfig = (config: Config): Payload => {
  const pkg = fs.readJsonSync(paths.appPackageJson, { throws: false })
  const repoUrl = getRepoUrl()

  return {
    title: config.title,
    description: config.description,
    menu: config.menu,
    ordering: config.ordering,
    version: get(pkg, 'version'),
    repository: repoUrl,
    native: config.native,
    codeSandbox: config.codeSandbox,
    themeConfig: config.themeConfig,
  }
}

const updateConfig = (config: Config) => async ({ setState }: Params) =>
  setState('config', load('docz', getInitialConfig(config), true, false))

export const state = (config: Config): State => {
  const watcher = chokidar.watch(finds('docz'), {
    cwd: paths.root,
    ignored: /(((^|[\/\\])\..+)|(node_modules))/,
    persistent: true,
  })

  watcher.setMaxListeners(Infinity)

  return {
    id: 'config',
    init: updateConfig(config),
    close: () => watcher.close(),
    update: async params => {
      const update = updateConfig(config)
      const fn = async () => update(params)

      watcher.on('add', fn)
      watcher.on('change', fn)
      watcher.on('unlink', fn)

      return () => watcher.close()
    },
  }
}
