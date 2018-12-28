import { load } from 'load-cfg'
import merge from 'deepmerge'
import getCacheIdentifier from 'react-dev-utils/getCacheIdentifier'

import { Config, Env } from '../config/argv'
import { Plugin } from '../lib/Plugin'

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
      require.resolve('babel-preset-react-app'),
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
          'docz-core',
        ]),
    compact: isProd,
    plugins: [require.resolve('babel-plugin-export-metadata')].concat(
      !isProd ? [require.resolve('react-hot-loader/babel')] : []
    ),
  })

  const reduce = Plugin.reduceFromPlugins<BabelRC>(args.plugins)
  const newConfig = reduce('modifyBabelRc', config, args)

  return args.modifyBabelRc(newConfig, args)
}
