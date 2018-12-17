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
      require.resolve('babel-preset-docz'),
      {
        flow: !args.typescript,
        typescript: args.typescript,
        parseProps: args.propsParser && !args.typescript,
      },
    ],
  ]

  const defaultPlugins: any[] = [
    [
      require.resolve('docz-utils/lib/named-asset-import'),
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
    ...(args.debug && {
      cacheDirectory: true,
      cacheIdentifier: getCacheIdentifier(
        isProd ? 'production' : isDev && 'development',
        [
          'docz',
          'docz-theme-default',
          'docz-utils',
          'docz-core',
          'babel-preset-docz',
        ]
      ),
    }),
    cacheCompression: isProd,
    compact: isProd,
    plugins: defaultPlugins.concat(
      !isProd ? [require.resolve('react-hot-loader/babel')] : []
    ),
  })

  const reduce = Plugin.reduceFromPlugins<BabelRC>(args.plugins)
  const newConfig = reduce('modifyBabelRc', config, args)

  return args.modifyBabelRc(newConfig, args)
}
