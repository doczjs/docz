import * as path from 'path'
import * as fs from 'fs-extra'
import { load, loadFrom, finds } from 'load-cfg'
import chokidar from 'chokidar'
import get from 'lodash/get'

import * as paths from '../config/paths'
import { Params, State } from '../lib/DataServer'
import { Config, Menu, ThemeConfig } from '../config/argv'
import { getRepoUrl } from '../utils/repo-info'

interface Payload {
  title: string
  description: string
  menu: Menu[]
  version: string | null
  repository: string | null
  native: boolean
  themeConfig: ThemeConfig
  separator: string
}

const getInitialConfig = (config: Config): Payload => {
  const pkg = fs.readJsonSync(paths.appPackageJson, { throws: false })
  const repoUrl = getRepoUrl()

  return {
    title: config.title,
    description: config.description,
    menu: config.menu,
    version: get(pkg, 'version'),
    repository: repoUrl,
    native: config.native,
    themeConfig: config.themeConfig,
    separator: config.separator,
  }
}

const update = async (params: Params, initial: Payload, { config }: Config) => {
  const pathToConfig = path.join(paths.docz, 'doczrc.js')
  const next = config
    ? loadFrom(pathToConfig, initial, true, true)
    : load('docz', initial, true, true)

  params.setState('config', next)
}

export const WATCH_IGNORE = /(((^|[\/\\])\.((?!docz)(.+)))|(node_modules))/

export const createWatcher = (glob: any, config: Config) => {
  const ignored = config.watchIgnore || WATCH_IGNORE
  const watcher = chokidar.watch(glob, {
    ignored,
    cwd: paths.root,
    persistent: true,
  })

  watcher.setMaxListeners(Infinity)
  return watcher
}

export const state = (config: Config, dev?: boolean): State => {
  const glob = config.config || finds('docz')
  const initial = getInitialConfig(config)
  const watcher = createWatcher(glob, config)

  return {
    id: 'config',
    start: async params => {
      const fn = async () => update(params, initial, config)
      await update(params, initial, config)

      if (dev) {
        watcher.on('add', fn)
        watcher.on('change', fn)
        watcher.on('unlink', fn)
      }
    },
    close: () => {
      watcher.close()
    },
  }
}
