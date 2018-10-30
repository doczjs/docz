import * as fs from 'fs-extra'
import { load, finds } from 'load-cfg'
import chokidar from 'chokidar'
import get from 'lodash.get'

import { Params, State } from '../DataServer'
import { Config, Menu, ThemeConfig } from '../commands/args'
import { getRepoUrl } from '../utils/repo-info'
import * as paths from '../config/paths'

interface Payload {
  title: string
  description: string
  ordering: string
  themeConfig: ThemeConfig
  menu: Menu[]
  version: string | null
  repository: string | null
  native: boolean
  codeSandbox: boolean
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
    native: config.native,
    codeSandbox: config.codeSandbox,
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

  const handleClose = () => watcher.close()

  return {
    init: updateConfig(config),
    close: handleClose,
    update: async params => {
      const update = updateConfig(config)
      const fn = async () => update(params)

      watcher.on('add', fn)
      watcher.on('change', fn)
      watcher.on('unlink', fn)

      return handleClose
    },
  }
}
