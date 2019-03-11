import { load } from 'load-cfg'
import { merge } from 'lodash/fp'
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
  env: Env,
  typescript?: boolean
): Promise<BabelRC> => {
  const isProd = env === 'production'
  const isDev = env === 'development'
  const localBabelRc = load('babel', { presets: [], plugins: [] }, false, true)
  const presets = [
    [
      require.resolve('babel-preset-react-app'),
      {
        typescript,
        flow: !args.typescript,
      },
    ],
  ]

  const defaultPlugins = [
    require.resolve('babel-plugin-export-metadata'),
    [
      require.resolve('babel-plugin-named-asset-import'),
      {
        loaderMap: {
          svg: {
            ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
          },
        },
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
    customize: require.resolve('babel-preset-react-app/webpack-overrides'),
    plugins: defaultPlugins.concat(
      !isProd ? [require.resolve('react-hot-loader/babel')] : []
    ),
  })

  const reduce = Plugin.reduceFromPlugins<BabelRC>(args.plugins)
  const newConfig = reduce('modifyBabelRc', config, args)

  return args.modifyBabelRc(newConfig, args)
}
