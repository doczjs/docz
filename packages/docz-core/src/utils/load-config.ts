import * as path from 'path'

import { load, loadFrom } from 'load-cfg'

import * as paths from '../config/paths'
import { Config } from '../commands/args'
import { Plugin } from '../Plugin'
import { omit } from './helpers'
import { BabelRC } from './babel-config'

const toOmit = ['_', '$0', 'version', 'help']

const defaultHtmlContext = {
  lang: 'en',
}

export const loadConfig = (args: Config): Config => {
  const defaultConfig = {
    ...args,
    hashRouter: false,
    native: false,
    plugins: [],
    mdPlugins: [],
    hastPlugins: [],
    themeConfig: {},
    htmlContext: defaultHtmlContext,
    menu: [],
    modifyBundlerConfig: (config: any) => config,
    modifyBabelRc: (babelrc: BabelRC) => babelrc,
  }

  const config = args.config
    ? loadFrom<Config>(path.resolve(args.config), defaultConfig)
    : load<Config>('docz', defaultConfig)

  const reduce = Plugin.reduceFromPlugins<Config>(config.plugins)
  return omit<Config>(toOmit, reduce('setConfig', { ...config, paths }))
}
