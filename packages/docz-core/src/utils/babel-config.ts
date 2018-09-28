import { load } from 'load-cfg'
import merge from 'deepmerge'

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
    cacheDirectory: !args.debug,
    babelrc: false,
    plugins: defaultPlugins.concat(
      !isProd ? [require.resolve('react-hot-loader/babel')] : []
    ),
  })

  const reduce = Plugin.reduceFromPlugins<BabelRC>(args.plugins)
  const newConfig = reduce('modifyBabelRc', config, args)

  return args.modifyBabelRc(newConfig, args)
}
