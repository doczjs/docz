import * as path from 'path'
import * as webpack from 'webpack'
import { Configuration } from 'webpack'
import { ConfigArgs } from 'docz-core'
import { load } from 'load-cfg'
import merge from 'deepmerge'
import Webpackbar from 'webpackbar'
import Config from 'webpack-chain'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import friendlyErrors from 'friendly-errors-webpack-plugin'

const INLINE_LIMIT = 10000

export const createConfig = (args: ConfigArgs) => (): Configuration => {
  const { paths, env, debug } = args

  const isProd = env === 'production'
  const config = new Config()

  /**
   * general
   */
  config.context(paths.root)
  config.set('mode', isProd && !debug ? 'production' : 'development')

  config.when(debug, cfg => cfg.devtool('source-map'))
  config.when(!isProd, cfg => cfg.devtool('cheap-module-eval-source-map'))
  config.devServer.quiet(!debug)

  config.node.merge({
    child_process: 'empty',
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  })

  /**
   * output
   */
  const outputProd = (output: Config.Output) =>
    output
      .filename('static/js/[name].[chunkhash:8].js')
      .sourceMapFilename('static/js/[name].[chunkhash:8].js.map')
      .publicPath(paths.servedPath)

  const outputDev = (output: Config.Output) =>
    output
      .filename('static/js/[name].js')
      .sourceMapFilename('static/js/[name].js.map')
      .publicPath('/')

  config.output
    .pathinfo(true)
    .path(paths.dist)
    .when(isProd, outputProd, outputDev )
    .crossOriginLoading('anonymous')

  /**
   * entries
   */

  const addHotClientEntry = (entry: Config.EntryPoint) =>
    entry.add(require.resolve('react-dev-utils/webpackHotDevClient'))

  config
    .entry('app')
      .when(!isProd, addHotClientEntry)
      .add(require.resolve('babel-polyfill'))
      .add(paths.indexJs)

  /**
   * resolve
   */

  config.resolve
    .set('symlinks', true)
    .alias
      .set('@babel/runtime', path.dirname(
        require.resolve('@babel/runtime/package.json')
      ))

  config.resolve
    .extensions
      .merge(['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'])
      .end()
    .modules
      .add('node_modules')
      .add(paths.root)

  config.resolveLoader
    .set('symlinks', true)
    .modules
      .add('node_modules')
      .add(paths.root)

  /**
   * loaders
   */

  const babelrc = merge(load('babel', null), {
    babelrc: false,
    cacheDirectory: true,
    highlightCode: true,
    plugins: [require.resolve('react-hot-loader/babel')],
    presets: [require.resolve('babel-preset-react-app')],
  })

  config.module
    .rule('js')
      .test(/\.js?x$/)
        .include
          .add(paths.root)
          .add(paths.docz)
          .end()
        .exclude
          .add(/node_modules/)
          .end()
        .use('thread-loader')
          .loader(require.resolve('thread-loader'))
          .end()
        .use('babel-loader')
          .loader(require.resolve('babel-loader'))
          .options(babelrc)

  config.module
    .rule('images')
      .test(/\.(png|jpe?g|gif)(\?.*)?$/)
      .use('url-loader')
        .loader(require.resolve('url-loader'))
        .options({
          limit: INLINE_LIMIT,
          name: `static/img/[name].[hash:8].[ext]`,
        })

  config.module
    .rule('svg')
      .test(/\.(svg)(\?.*)?$/)
      .use('file-loader')
        .loader(require.resolve('file-loader'))
        .options({
          name: `static/img/[name].[hash:8].[ext]`,
        })

  config.module
    .rule('media')
      .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
      .use('url-loader')
        .loader(require.resolve('url-loader'))
        .options({
          limit: INLINE_LIMIT,
          name: `static/media/[name].[hash:8].[ext]`,
        })

  config.module
    .rule('fonts')
      .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
      .use('url-loader')
        .loader(require.resolve('url-loader'))
        .options({
          limit: INLINE_LIMIT,
          name: `static/fonts/[name].[hash:8].[ext]`,
        })

  /**
   * plugins
   */

  config.when(!isProd, cfg =>
    cfg
      .plugin('hot-module-replacement-plugin')
      .use(webpack.HotModuleReplacementPlugin)
  )

  config
    .plugin('named-modules-plugin')
      .use(webpack.NamedModulesPlugin)
      .end()
    .plugin('no-emit-errors')
      .use(webpack.NoEmitOnErrorsPlugin)
      .end()
    .plugin('html-webpack-plugin')
      .use(HtmlWebpackPlugin, [{
        inject: true,
        template: paths.indexHtml,
      }])

  config.when(!debug, cfg =>{
    cfg
      .plugin('webpackbar')
      .use(Webpackbar, [{
        color: '#41b883',
        compiledIn: false,
        name: 'Client',
      }])
    cfg
      .plugin('friendly-errors')
      .use(friendlyErrors)
  })

  return config.toConfig()
}
