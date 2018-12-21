import { load } from 'load-cfg'
import merge from 'deepmerge'
import getCacheIdentifier from 'react-dev-utils/getCacheIdentifier'

import { Config, Env } from '../commands/args'
import { Plugin } from '../Plugin'

export interface BabelRC {
  presets: any[]
  plugins: any[]
  cacheDirectory?: boolean
  babelrc?: boolean
}

export const getBabelConfig = async (
  args: Config,
  env: Env
): Promise<BabelRC> => {
  const isProd = env === 'production'
  const isDev = env === 'development'
  const localBabelRc = load('babel', { presets: [], plugins: [] }, false, true)
  const presets = [
    [
      require.resolve('poi/babel'),
      {
        flow: !args.typescript,
        typescript: args.typescript,
      },
    ],
  ]

  const config = merge(localBabelRc, {
    presets,
    babelrc: false,
    cacheCompression: args.debug ? false : isProd,
    cacheDirectory: !args.debug,
    cacheIdentifier: args.debug
      ? null
      : getCacheIdentifier(isProd ? 'production' : isDev && 'development', [
          'docz',
          'docz-theme-default',
          'docz-utils',
          'docz-core',
          'babel-preset-docz',
        ]),
    compact: isProd,
    plugins: !isProd ? [require.resolve('react-hot-loader/babel')] : [],
  })

  const reduce = Plugin.reduceFromPlugins<BabelRC>(args.plugins)
  const newConfig = reduce('modifyBabelRc', config, args)

  return args.modifyBabelRc(newConfig, args)
}
