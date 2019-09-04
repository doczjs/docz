import * as path from 'path'
import { Arguments } from 'yargs'
import { omit } from 'lodash/fp'
import { load, loadFrom } from 'load-cfg'
import { merge } from 'lodash/fp'
import detectPort from 'detect-port'

import * as paths from '../config/paths'
import { Config, Argv } from '../config/argv'
import { Plugin } from '../lib/Plugin'

const toOmit = ['_', '$0', 'version', 'help']
export const doczRcBaseConfig = {
  themeConfig: {},
  themesDir: 'src',
  docgenConfig: {},
  menu: [],
  plugins: [],
  mdPlugins: [],
  hastPlugins: [],
  ignore: [
    /readme.md/i,
    /changelog.md/i,
    /code_of_conduct.md/i,
    /contributing.md/i,
    /license.md/i,
  ],
  filterComponents: (files: string[]) =>
    files.filter(filepath => /\/[A-Z]\w*\.(js|jsx|ts|tsx)$/.test(filepath)),
}

export const getBaseConfig = (
  argv: Arguments<Argv>,
  custom?: Partial<Config>
): Config => {
  const initial = omit<Arguments<Argv>, any>(toOmit, argv)
  const base = { ...doczRcBaseConfig, ...initial, paths }
  return merge(base, custom) as Config
}

export const parseConfig = async (
  argv: Arguments<Argv>,
  custom?: Partial<Config>
): Promise<Config> => {
  const port = await detectPort(argv.port)
  const defaultConfig = getBaseConfig(argv, { port, ...custom })

  const config = argv.config
    ? loadFrom<Config>(path.resolve(argv.config), defaultConfig)
    : load<Config>('docz', defaultConfig)

  const reduceAsync = Plugin.reduceFromPluginsAsync<Config>(config.plugins)
  return reduceAsync('setConfig', config)
}
