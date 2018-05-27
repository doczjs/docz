import { load } from 'load-cfg'
import merge from 'deepmerge'

import { Config } from '../commands/args'
import { isFn } from './helpers'

export const babelrc = (args: Config) => {
  const config = merge(load('babel', null), {
    babelrc: false,
    cacheDirectory: !args.debug,
    presets: [require.resolve('babel-preset-react-app')],
    plugins: [],
  })

  return [...(args.plugins || [])].reduce(
    (obj, plugin) =>
      isFn(plugin.modifyBabelRc)
        ? merge(obj, plugin.modifyBabelRc(config))
        : obj,
    config
  )
}
