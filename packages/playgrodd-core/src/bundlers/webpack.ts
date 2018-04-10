import * as errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware'
import * as path from 'path'
import { Application } from 'express'
import { Loader, Configuration } from 'webpack'
import * as webpack from 'webpack'
import * as merge from 'deepmerge'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as webpackDevServerUtils from 'react-dev-utils/WebpackDevServerUtils'
import * as WebpackDevServer from 'webpack-dev-server'

import { loadConfig } from '../utils/load-config'
import * as paths from '../config/paths'

import { Bundler } from '../Bundler'
import { Entry } from '../Entry'

export const PORT = 3000
export const PROTOCOL = process.env.HTTPS === 'true' ? 'https' : 'http'
export const HOST = process.env.HOST || '0.0.0.0'

const devServerConfig = () => ({
  compress: true,
  clientLogLevel: 'none',
  contentBase: paths.PLAYGRODD,
  watchContentBase: true,
  hot: true,
  quiet: true,
  noInfo: true,
  publicPath: '/',
  https: PROTOCOL === 'https',
  host: HOST,
  overlay: false,
  watchOptions: {
    ignored: /node_modules/,
  },
  stats: {
    colors: true,
    chunks: false,
    chunkModules: false,
  },
  historyApiFallback: {
    disableDotRule: true,
  },
  before(app: Application) {
    app.use(errorOverlayMiddleware())
  },
})

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

const config = (entries: Entry[]): Configuration => ({
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

const setup = (config: Configuration) => {
  const appName = require(paths.PACKAGE_JSON).name
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
  const urls = webpackDevServerUtils.prepareUrls(protocol, HOST, PORT)

  return webpackDevServerUtils.createCompiler(
    webpack,
    config,
    appName,
    urls,
    true
  )
}

const server = (compiler: any): WebpackDevServer =>
  new WebpackDevServer(compiler, devServerConfig())

export const bundler = (): Bundler =>
  new Bundler<Configuration, WebpackDevServer>({
    id: 'webpack',
    config,
    setup,
    server,
  })
