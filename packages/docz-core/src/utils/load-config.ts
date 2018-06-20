import { load } from 'load-cfg'

import * as paths from '../config/paths'
import { Config } from '../commands/args'
import { Plugin } from '../Plugin'
import { omit } from './helpers'
import { BabelRC } from './babelrc'

const toOmit = ['_', '$0', 'version', 'help']

export const loadConfig = (args: Config): Config => {
  const config = load('docz', {
    ...args,
    paths,
    hashRouter: false,
    plugins: [],
    mdPlugins: [],
    hastPlugins: [],
    themeConfig: {},
    modifyBundlerConfig: (config: any) => config,
    modifyBabelRc: (babelrc: BabelRC) => babelrc,
  })

  const reduce = Plugin.reduceFromPlugins<Config>(config.plugins)
  return omit<Config>(toOmit, reduce('setConfig', config))
}
