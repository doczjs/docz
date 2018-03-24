import * as path from 'path'
import { Loader, Configuration } from 'webpack'
import * as webpack from 'webpack'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as merge from 'deepmerge'

import { IEntryObj } from './files-parser'
import { loadConfig } from '../utils/load-config'
import * as paths from '../config/paths'

const babelLoader = (): Loader => {
  const babelrc = loadConfig('babel', null)
  const options = merge(babelrc, {
    babelrc: false,
    cacheDirectory: true,
    presets: [
      require.resolve('@babel/preset-env'),
      require.resolve('@babel/preset-react'),
    ],
    plugins: [require.resolve('react-hot-loader/babel')],
  })

  return {
    options,
    loader: require.resolve('babel-loader'),
  }
}

export const createConfig = async (
  entries: IEntryObj[]
): Promise<Configuration> => {
  return {
    mode: 'development',
    context: paths.ROOT,
    devtool: '#source-map',
    entry: [require.resolve('babel-polyfill'), paths.INDEX_JS],
    output: {
      pathinfo: true,
      path: paths.DIST,
      publicPath: '/',
      filename: 'static/js/[name].js',
      sourceMapFilename: 'static/js/[name].js.map',
      crossOriginLoading: 'anonymous',
      devtoolModuleFilenameTemplate: (info: any) =>
        path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          include: [paths.ROOT],
          use: babelLoader(),
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      modules: [paths.ROOT, 'node_modules'],
      alias: {
        src: path.join(paths.ROOT, 'src'),
      },
    },
    devServer: {
      contentBase: paths.DIST,
      hot: true,
    },
    plugins: [
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new HtmlWebpackPlugin({
        template: paths.INDEX_HTML,
      }),
    ],
  }
}
