import * as path from 'path'
import { Configuration } from 'webpack'
import * as webpack from 'webpack'
import * as HtmlWebpackPlugin from 'html-webpack-plugin'
import * as webpackDevServerUtils from 'react-dev-utils/WebpackDevServerUtils'
import * as WebpackDevServer from 'webpack-dev-server'
import { ConfigArgs as Config, Entry } from 'playgrodd-core'

import { devServerConfig } from './config-devserver'
import * as loaders from './loaders'

export const config = ({ paths, host, src }: Config) => (
  entries: Entry[]
): Configuration => {
  const srcPath = path.resolve(paths.root, src)

  return {
    mode: 'development',
    devtool: '#source-map',
    context: paths.root,
    entry: [
      require.resolve('babel-polyfill'),
      require.resolve('react-dev-utils/webpackHotDevClient'),
      paths.indexJs,
    ],
    output: {
      pathinfo: true,
      path: paths.dist,
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
              include: [srcPath, paths.playgrodd],
              use: [require.resolve('thread-loader'), loaders.babel],
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
      modules: ['node_modules', srcPath],
      alias: {
        '@babel/runtime': path.dirname(
          require.resolve('@babel/runtime/package.json')
        ),
      },
    },
    plugins: [
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.indexHtml,
      }),
    ],
  }
}

export const setup = ({ paths, port, host, protocol }: Config) => (
  config: Configuration
) => {
  const appName = require(paths.packageJson).name
  const urls = webpackDevServerUtils.prepareUrls(protocol, host, port)

  return webpackDevServerUtils.createCompiler(
    webpack,
    config,
    appName,
    urls,
    true
  )
}

export const server = (config: Config) => (compiler: any): WebpackDevServer =>
  new WebpackDevServer(compiler, devServerConfig(config))
