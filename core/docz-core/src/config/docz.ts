import * as path from 'path'
import { Arguments } from 'yargs'
import { omit, merge } from 'lodash/fp'
import { load, loadFrom } from 'load-cfg'
import detectPort from 'detect-port'
import fs from 'fs-extra'

import * as paths from '../config/paths'
import { Config, Argv } from '../config/argv'
import { Plugin } from '../lib/Plugin'

const toOmit = ['_', '$0', 'version', 'help']
export const doczRcBaseConfig = {
  typescript: fs.existsSync(paths.appTsConfig),
  themeConfig: {},
  src: './',
  gatsbyRoot: './',
  themesDir: 'src',
  mdxExtensions: ['.md', '.mdx'],
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
    files.filter(filepath => {
      const isTestFile = /\.(test|spec)\.(js|jsx|ts|tsx)$/.test(filepath)
      if (isTestFile) {
        return false
      }
      const startsWithCapitalLetter = /\/([A-Z]\w*)\.(js|jsx|ts|tsx)$/.test(
        filepath
      )
      const isCalledIndex = /\/index\.(js|jsx|ts|tsx)$/.test(filepath)
      const hasJsxOrTsxExtension = /.(jsx|tsx)$/.test(filepath)
      return startsWithCapitalLetter || isCalledIndex || hasJsxOrTsxExtension
    }),
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
    ? loadFrom<Config>(path.join(paths.docz, 'doczrc.js'), defaultConfig)
    : load<Config>('docz', defaultConfig)

  const reduceAsync = Plugin.reduceFromPluginsAsync<Config>(config.plugins)
  return reduceAsync('setConfig', config)
}
