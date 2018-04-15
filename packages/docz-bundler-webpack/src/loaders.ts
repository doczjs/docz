import { Loader } from 'webpack'

import * as merge from 'deepmerge'
import { load } from 'load-cfg'

export const babel: Loader = {
  loader: require.resolve('babel-loader'),
  options: merge(load('babel', null), {
    babelrc: false,
    cacheDirectory: true,
    highlightCode: true,
    presets: [require.resolve('babel-preset-react-app')],
    plugins: [require.resolve('react-hot-loader/babel')],
  }),
}
