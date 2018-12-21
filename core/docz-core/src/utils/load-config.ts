import * as path from 'path'
import omit from 'lodash/omit'

import { load, loadFrom } from 'load-cfg'

import * as paths from '../config/paths'
import { BabelRC } from '../config/babel'
import { Config } from '../commands/args'
import { Plugin } from '../Plugin'

const toOmit = ['_', '$0', 'version', 'help']
const htmlContext = {
  lang: 'en',
  favicon: 'https://cdn-std.dprcdn.net/files/acc_649651/LUKiMl',
}

export const loadConfig = async (args: Config): Promise<Config> => {
  const defaultConfig = {
    ...args,
    htmlContext,
    plugins: [],
    mdPlugins: [],
    hastPlugins: [],
    menu: [],
    ignore: [
      'readme.md',
      'changelog.md',
      'code_of_conduct.md',
      'contributing.md',
      'license.md',
    ],
    themeConfig: {},
    docgenConfig: {},
    modifyBundlerConfig: (config: any) => config,
    modifyBabelRc: (babelrc: BabelRC) => babelrc,
    onCreateWebpackChain: () => null,
  }

  const config = args.config
    ? loadFrom<Config>(path.resolve(args.config), defaultConfig)
    : load<Config>('docz', defaultConfig)

  const reduceAsync = Plugin.reduceFromPluginsAsync<Config>(config.plugins)
  return omit<Config, any>(
    await reduceAsync('setConfig', { ...config, paths }),
    toOmit
  )
}
