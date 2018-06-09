import { load } from 'load-cfg'

import * as paths from '../config/paths'
import { Config } from '../commands/args'
import { Plugin } from '../Plugin'
import { omit } from './helpers'

const toOmit = ['_', '$0', 'version', 'help']

export const loadConfig = (args: Config): Config => {
  const config = load('docz', {
    ...args,
    paths,
    plugins: [],
    mdPlugins: [],
    hastPlugins: [],
    themeConfig: {},
    modifyBundlerConfig: (config: any) => config,
  })

  const reduce = Plugin.reduceFromPlugins<Config>(config.plugins)
  return omit<Config>(toOmit, reduce('setConfig', config))
}
