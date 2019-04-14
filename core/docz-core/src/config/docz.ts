import * as path from 'path'
import { Arguments } from 'yargs'
import { omit } from 'lodash/fp'
import { load, loadFrom } from 'load-cfg'
import { merge } from 'lodash/fp'
import detectPort from 'detect-port'

import * as paths from '../config/paths'
import { BabelRC } from '../config/babel'
import { Config, Argv } from '../config/argv'
import { Plugin } from '../lib/Plugin'

const toOmit = ['_', '$0', 'version', 'help']
const htmlContext = {
  lang: 'en',
  favicon: 'https://cdn-std.dprcdn.net/files/acc_649651/LUKiMl',
}

export const doczRcBaseConfig = {
  htmlContext,
  runKit: false,
  themeConfig: {},
  docgenConfig: {},
  filterComponents: (files: string[]) =>
    files.filter(filepath => /\/[A-Z]\w*\.(js|jsx|ts|tsx)$/.test(filepath)),
  modifyBundlerConfig: (config: any) => config,
  modifyBabelRc: (babelrc: BabelRC) => babelrc,
  onCreateWebpackChain: () => null,
  menu: [],
  plugins: [],
  mdPlugins: [],
  hastPlugins: [],
  ignore: [
    '**/readme.md',
    '**/changelog.md',
    '**/code_of_conduct.md',
    '**/contributing.md',
    '**/license.md',
  ],
}

export const getBaseConfig = (
  argv: Arguments<Argv>,
  custom?: Partial<Config>
): Config => {
  const initial = omit<Arguments<Argv>, any>(toOmit, argv)
  const base = { ...initial, ...doczRcBaseConfig, paths }
  return merge(base, custom) as Config
}

export const parseConfig = async (
  argv: Arguments<Argv>,
  custom?: Partial<Config>
): Promise<Config> => {
  const port = await detectPort(argv.port)
  const websocketPort = await detectPort(argv.websocketPort)
  const defaultConfig = getBaseConfig(argv, {
    port,
    websocketPort,
    htmlContext,
    ...custom,
  })

  const config = argv.config
    ? loadFrom<Config>(path.resolve(argv.config), defaultConfig)
    : load<Config>('docz', defaultConfig)

  const reduceAsync = Plugin.reduceFromPluginsAsync<Config>(config.plugins)
  return reduceAsync('setConfig', config)
}
