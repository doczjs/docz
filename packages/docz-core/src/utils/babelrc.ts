import { load } from 'load-cfg'
import merge from 'deepmerge'

import { Config } from '../commands/args'
import { isFn } from './helpers'

export const babelrc = (args: Config) => {
  const config = merge(load('babel', null), {
    babelrc: false,
    cacheDirectory: !args.debug,
    presets: [
      [require.resolve('babel-preset-react-app'), { flow: !args.typescript }],
      ...(args.typescript ? [require.resolve('@babel/preset-typescript')] : []),
    ],
    plugins: [],
  })

  return [...(args.plugins || [])].reduce(
    (obj, plugin) =>
      plugin.modifyBabelRc && isFn(plugin.modifyBabelRc)
        ? plugin.modifyBabelRc(config)
        : obj,
    config
  )
}
