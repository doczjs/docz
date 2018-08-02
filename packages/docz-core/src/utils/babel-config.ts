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

/**
 * Presets configuration
 */

const PRESETS_REACT = /@babel\/preset-env|@babel\/preset-react|babel-preset-react-app|next\/babel|razzle/
const PRESET_TS = /@babel\/preset-typescript/

const getPresets = (args: Config, { presets }: BabelRC) => {
  const hasPresets = presets && presets.length > 0
  const needReact = !hasPresets || presets.every(p => !PRESETS_REACT.test(p))
  const needTSPreset = !hasPresets || presets.every(p => !PRESET_TS.test(p))

  const newPresets: any[] = needReact
    ? [[require.resolve('babel-preset-react-app'), { flow: !args.typescript }]]
    : []

  if (needTSPreset && args.typescript) {
    newPresets.push(require.resolve('@babel/preset-typescript'))
  }

  return newPresets
}

/**
 * Plugins configuration
 */

const PRESETS_WITH_DYNAMIC = /babel-preset-react-app|next\/babel|razzle/
const DYNAMIC_IMPORT = /(babel-|@babel\/)plugin-syntax-dynamic-import/
const HOT_LOADER = /react-hot-loader\/babel/
const DOCGEN = /babel-plugin-react-docgen/

const getPlugins = (args: Config, env: Env, { presets, plugins }: BabelRC) => {
  const newPlugins: any[] = []
  const isProd = env === 'production'
  const hasPresets = presets && presets.length > 0

  const needHotLoader = plugins.every(p => !HOT_LOADER.test(p))
  const needReactDocgen = plugins.every(p => !DOCGEN.test(p))
  const needBabelDynamicImport =
    hasPresets &&
    presets.every(p => !PRESETS_WITH_DYNAMIC.test(p)) &&
    plugins.every(p => !DYNAMIC_IMPORT.test(p))

  if (needHotLoader && !isProd) {
    newPlugins.push(require.resolve('react-hot-loader/babel'))
  }

  if (needReactDocgen && args.propsParser && !args.typescript) {
    newPlugins.push([
      require.resolve('babel-plugin-react-docgen'),
      { resolver: 'findAllExportedComponentDefinitions' },
    ])
  }

  if (needBabelDynamicImport) {
    newPlugins.push(require.resolve('@babel/plugin-syntax-dynamic-import'))
  }

  return newPlugins
}

/**
 * Exporting .babelrc config used on docz
 */

export const getBabelConfig = async (
  args: Config,
  env: Env
): Promise<BabelRC> => {
  const localBabelRc = load('babel', { presets: [], plugins: [] })
  const presets = getPresets(args, localBabelRc)
  const plugins = getPlugins(args, env, localBabelRc)

  const config = merge(localBabelRc, {
    presets,
    plugins,
    cacheDirectory: !args.debug,
    babelrc: false,
  })

  const reduce = Plugin.reduceFromPlugins<BabelRC>(args.plugins)
  const newConfig = reduce('modifyBabelRc', config, args)

  return args.modifyBabelRc(newConfig, args)
}
