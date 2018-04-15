import { Loader } from 'webpack'
import { load } from 'load-cfg'
import merge from 'deepmerge'

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
