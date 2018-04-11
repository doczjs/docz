import * as path from 'path'
import { Configuration } from 'webpack'
import * as webpack from 'webpack'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as webpackDevServerUtils from 'react-dev-utils/WebpackDevServerUtils'
import * as WebpackDevServer from 'webpack-dev-server'
import { IBundlerFactoryParams as Args, Entry } from 'playgrodd-core'

import { devServerConfig } from './config-devserver'
import * as loaders from './loaders'

const HOST = process.env.HOST || '0.0.0.0'

export const config = ({ paths }: Args) => (
  entries: Entry[]
): Configuration => ({
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
        oneOf: [
          {
            test: /\.(js|jsx|mjs)$/,
            exclude: /node_modules/,
            include: [paths.ROOT],
            use: [require.resolve('thread-loader'), loaders.babel],
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
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

export const setup = ({ paths, port }: Args) => (config: Configuration) => {
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

export const server = (args: Args) => (compiler: any): WebpackDevServer =>
  new WebpackDevServer(compiler, devServerConfig(args))
