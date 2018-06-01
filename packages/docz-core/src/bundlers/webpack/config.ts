import * as path from 'path'
import webpackBarPlugin from 'webpackbar'
import Config from 'webpack-chain'
import friendlyErrors from 'friendly-errors-webpack-plugin'
import htmlWebpackPlugin from 'html-webpack-plugin'
import manifestPlugin from 'webpack-manifest-plugin'
import UglifyJs from 'uglifyjs-webpack-plugin'

import { BabelRC } from '../../utils/babelrc'
import { Config as Args } from '../../commands/args'
import * as loaders from './loaders'
import { Env } from './'

const uglify = new UglifyJs({
  parallel: true,
  cache: true,
  sourceMap: true,
  uglifyOptions: {
    parse: {
      ecma: 8,
    },
    compress: {
      ecma: 5,
      warnings: false,
      comparisons: false,
    },
    mangle: {
      safari10: true,
    },
    output: {
      ecma: 5,
      comments: false,
      ascii_only: true,
    },
  },
})

export const createConfig = (babelrc: BabelRC) => (
  args: Args,
  env: Env
): Config => {
  const { paths, debug } = args

  const srcPath = path.resolve(paths.root, args.src)
  const isProd = env === 'production'
  const config = new Config()

  /**
   * general
   */
  config.context(paths.root)
  config.set('mode', env)

  config.when(debug, cfg => cfg.devtool('source-map'))
  config.when(!isProd, cfg => cfg.devtool('cheap-module-eval-source-map'))

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
    .when(isProd, outputProd, outputDev)
    .crossOriginLoading('anonymous')

  /**
   * optimization
   */

  config.merge({
    optimization: {
      nodeEnv: 'dev',
      namedModules: true,
      noEmitOnErrors: true,
      runtimeChunk: true,
      splitChunks: {
        chunks: 'all',
        name: 'vendors',
      },
      ...(isProd && {
        minimizer: [uglify],
      }),
    },
  })

  /**
   * entries
   */

  config
    .entry('app')
    .add(require.resolve('babel-polyfill'))
    .add(paths.indexJs)

  /**
   * resolve
   */

  config.resolve
    .set('symlinks', true)
    .alias.set(
      '@babel/runtime',
      path.dirname(require.resolve('@babel/runtime/package.json'))
    )

  config.resolve.extensions
    .merge([
      '.web.js',
      '.mjs',
      '.js',
      '.json',
      '.web.jsx',
      '.jsx',
      '.mdx',
      ...(args.typescript ? ['.ts', '.tsx'] : []),
    ])
    .end()
    .modules.add('node_modules')
    .add(srcPath)

  config.resolveLoader
    .set('symlinks', true)
    .modules.add('node_modules')
    .add(paths.root)

  /**
   * loaders
   */

  loaders.js(config, args)
  loaders.mdx(config, args)
  args.typescript && loaders.ts(config, args)
  loaders.setupHappypack(config, args, babelrc)
  loaders.images(config)
  loaders.svg(config)
  loaders.media(config)
  loaders.fonts(config)

  /**
   * plugins
   */

  config.plugin('assets-plugin').use(manifestPlugin, [
    {
      filename: 'assets.json',
    },
  ])

  config.plugin('html-webpack-plugin').use(htmlWebpackPlugin, [
    {
      inject: true,
      template: paths.indexHtml,
      ...(isProd && {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
    },
  ])

  config.when(!debug && !isProd, cfg => {
    cfg.plugin('webpackbar').use(webpackBarPlugin, [
      {
        color: '#41b883',
        compiledIn: false,
        name: 'Client',
      },
    ])
    cfg.plugin('friendly-errors').use(friendlyErrors)
  })

  config.performance.hints(false)
  return config
}
