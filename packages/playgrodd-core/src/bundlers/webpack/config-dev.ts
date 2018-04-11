import * as path from 'path'
import { Loader, Configuration } from 'webpack'
import * as webpack from 'webpack'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as webpackDevServerUtils from 'react-dev-utils/WebpackDevServerUtils'
import * as WebpackDevServer from 'webpack-dev-server'
import * as merge from 'deepmerge'
import { load } from 'load-cfg'

import * as paths from '../../config/paths'
import { Entry } from '../../Entry'

import { devServerConfig } from './config-devserver'

const HOST = process.env.HOST || '0.0.0.0'

const babelLoader = (): Loader => {
  const babelrc = load('babel', null)
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

export const config = (entries: Entry[]): Configuration => ({
  mode: 'development',
  context: paths.ROOT,
  devtool: '#source-map',
  entry: [
    require.resolve('babel-polyfill'),
    require.resolve('react-dev-utils/webpackHotDevClient'),
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
        use: babelLoader(),
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    modules: [paths.ROOT, 'node_modules'],
    alias: {
      '@babel/runtime': path.dirname(
        require.resolve('@babel/runtime/package.json')
      ),
    },
  },
  devServer: {
    logLevel: 'silent',
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.INDEX_HTML,
    }),
  ],
})

export const setup = (port: number) => (config: Configuration) => {
  const appName = require(paths.PACKAGE_JSON).name
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
  const urls = webpackDevServerUtils.prepareUrls(protocol, HOST, port)

  return webpackDevServerUtils.createCompiler(
    webpack,
    config,
    appName,
    urls,
    true
  )
}

export const server = (compiler: any): WebpackDevServer =>
  new WebpackDevServer(compiler, devServerConfig())
