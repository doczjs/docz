import { load } from 'load-cfg'

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
  const config = load<Config>('docz', {
    ...args,
    hashRouter: false,
    plugins: [],
    mdPlugins: [],
    hastPlugins: [],
    themeConfig: {},
    htmlContext: defaultHtmlContext,
    menu: null,
    modifyBundlerConfig: (config: any) => config,
    modifyBabelRc: (babelrc: BabelRC) => babelrc,
  })

  const reduce = Plugin.reduceFromPlugins<Config>(config.plugins)
  return omit<Config>(toOmit, reduce('setConfig', { ...config, paths }))
}
