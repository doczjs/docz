import { load } from 'load-cfg'
import merge from 'deepmerge'

import { Config, Env } from '../commands/args'
import { Plugin } from '../Plugin'

export interface BabelRC {
  presets?: any[]
  plugins?: any[]
  cacheDirectory?: boolean
  babelrc?: boolean
}

const getPresets = (args: Config) => {
  const presets: any[] = [
    [require.resolve('babel-preset-react-app'), { flow: !args.typescript }],
  ]

  if (args.typescript) presets.push(require.resolve('@babel/preset-typescript'))
  return presets
}

const getPlugins = (args: Config, env: Env) => {
  const isProd = env === 'production'
  const plugins: any[] = []

  if (!isProd) {
    plugins.push(require.resolve('react-hot-loader/babel'))
  }

  if (args.propsParser && !args.typescript) {
    plugins.push([
      require.resolve('babel-plugin-react-docgen'),
      { resolver: 'findAllExportedComponentDefinitions' },
    ])
  }

  return plugins
}

export const babelrc = (args: Config, env: Env): BabelRC => {
  const presets = getPresets(args)
  const plugins = getPlugins(args, env)

  const config = merge(load('babel', null), {
    presets,
    plugins,
    cacheDirectory: !args.debug,
    babelrc: false,
  })

  const reduce = Plugin.reduceFromPlugins<BabelRC>(args.plugins)
  const newConfig = reduce('modifyBabelRc', config, args)

  return args.modifyBabelRc(newConfig, args)
}
