import * as path from 'path'
import { Arguments } from 'yargs'
import { omit } from 'lodash/fp'
import { load, loadFrom } from 'load-cfg'
import detectPort from 'detect-port'

import * as paths from '../config/paths'
import { BabelRC } from '../config/babel'
import { Config } from '../config/argv'
import { Plugin } from '../Plugin'

const toOmit = ['_', '$0', 'version', 'help']
const htmlContext = {
  lang: 'en',
  favicon: 'https://cdn-std.dprcdn.net/files/acc_649651/LUKiMl',
}

export const parseConfig = async (argv: Arguments): Promise<Config> => {
  const port = await detectPort(argv.port)
  const websocketPort = await detectPort(argv.websocketPort)
  const initial = omit<Arguments, any>(toOmit, argv)

  const defaultConfig: any = {
    ...initial,
    port,
    websocketPort,
    htmlContext,
    menu: [],
    plugins: [],
    mdPlugins: [],
    hastPlugins: [],
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

  const config = argv.config
    ? loadFrom<Config>(path.resolve(argv.config), defaultConfig)
    : load<Config>('docz', defaultConfig)

  const reduceAsync = Plugin.reduceFromPluginsAsync<Config>(config.plugins)
  return reduceAsync('setConfig', { ...config, paths })
}
