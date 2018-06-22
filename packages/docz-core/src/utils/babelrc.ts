import { load } from 'load-cfg'
import merge from 'deepmerge'

import { Config } from '../commands/args'
import { Plugin } from '../Plugin'

export interface BabelRC {
  presets?: any[]
  plugins?: any[]
  cacheDirectory?: boolean
  babelrc?: boolean
}

export const babelrc = (args: Config): BabelRC => {
  const config = merge(load('babel', null), {
    babelrc: false,
    cacheDirectory: !args.debug,
    presets: [
      [require.resolve('babel-preset-react-app'), { flow: !args.typescript }],
      ...(args.typescript ? [require.resolve('@babel/preset-typescript')] : []),
    ],
    plugins: [],
  })

  const reduce = Plugin.reduceFromPlugins<BabelRC>(args.plugins)
  return reduce('modifyBabelRc', args.modifyBabelRc(config))
}
