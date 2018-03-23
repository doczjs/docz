import * as fs from 'fs'
import * as path from 'path'
import * as findup from 'find-up'
import { Loader, Configuration } from 'webpack'
import * as webpack from 'webpack'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'

import { IEntryObj } from './files-parser'
import * as paths from '../config/paths'

const babelLoader = (babelrc: string | null): Loader => ({
  loader: require.resolve('babel-loader'),
  options: babelrc
    ? JSON.parse(babelrc)
    : {
        babelrc: false,
        cacheDirectory: true,
        presets: [
          require.resolve('@babel/preset-env'),
          require.resolve('@babel/preset-react'),
        ],
      },
})

export const createConfig = async (
  entries: IEntryObj[]
): Promise<Configuration> => {
  const babelrcPath = findup.sync(['.babelrc', 'babelrc.js'])
  const babelrc = babelrcPath ? fs.readFileSync(babelrcPath, 'utf-8') : null

  return {
    mode: 'development',
    context: paths.ROOT,
    devtool: '#source-map',
    entry: [
      require.resolve('babel-polyfill'),
      `${require.resolve(
        'webpack-hot-middleware/client'
      )}?path=/__webpack_hmr&timeout=20000'`,
      ...entries.map(entry => entry.filepath),
      paths.INDEX_JS,
    ],
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
          use: babelLoader(babelrc),
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      modules: [paths.ROOT, 'node_modules'],
      alias: { src: path.join(paths.ROOT, 'src') },
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
