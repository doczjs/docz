import * as path from 'path'
import { Configuration } from 'webpack'
import webpackBarPlugin from 'webpackbar'
import Config from 'webpack-chain'
import friendlyErrors from 'friendly-errors-webpack-plugin'
import htmlWebpackPlugin from 'html-webpack-plugin'
import manifestPlugin from 'webpack-manifest-plugin'
import UglifyJs from 'uglifyjs-webpack-plugin'

import { Config as Args, Env } from '../../commands/args'
import { BabelRC } from '../../utils/babelrc'
import * as paths from '../../config/paths'
import * as loaders from './loaders'

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

export const createConfig = (args: Args, env: Env) => (
  babelrc: BabelRC
): Configuration => {
  const { debug, host, port, protocol } = args

  const config = new Config()
  const isProd = env === 'production'
  const base = paths.servedPath(args.base)
  const dist = paths.getDist(args.dest)
  const srcPath = path.resolve(paths.root, args.src)

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
      .filename('static/js/[name].[hash].js')
      .sourceMapFilename('static/js/[name].[hash].js.map')
      .chunkFilename('static/js/[name].[chunkhash:8].js')
      .publicPath(base)

  const outputDev = (output: Config.Output) =>
    output
      .filename('static/js/[name].js')
      .sourceMapFilename('static/js/[name].js.map')
      .publicPath('/')

  config.output
    .pathinfo(true)
    .path(dist)
    .when(isProd, outputProd, outputDev)
    .crossOriginLoading('anonymous')

  /**
   * optimization
   */

  config.merge({
    optimization: {
      nodeEnv: env,
      namedModules: true,
      noEmitOnErrors: true,
      runtimeChunk: true,
      splitChunks: {
        chunks: 'all',
        name: 'vendors',
      },
      ...(isProd && {
        minimize: true,
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

  const addExtensions = (resolve: any) => {
    resolve.extensions
      .add('.web.js')
      .add('.mjs')
      .add('.js')
      .add('.json')
      .add('.web.jsx')
      .add('.jsx')
      .add('.mdx')
      .end()

    if (args.typescript) {
      resolve.extensions
        .prepend('.ts')
        .prepend('.tsx')
        .end()
    }
  }

  addExtensions(config.resolve)
  addExtensions(config.resolveLoader)

  config.resolve.modules
    .add('node_modules')
    .add(srcPath)
    .add(paths.root)

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

  const isLocalhost = host === '127.0.0.1' || host === '0.0.0.0'
  const hostname = isLocalhost ? 'localhost' : host

  config.when(!debug && !isProd, cfg => {
    cfg.plugin('webpackbar').use(webpackBarPlugin, [
      {
        color: '#41b883',
        compiledIn: false,
        name: 'Client',
      },
    ])
    cfg.plugin('friendly-errors').use(friendlyErrors, [
      {
        compilationSuccessInfo: {
          messages: [
            `Your application is running at ${protocol}://${hostname}:${port}`,
          ],
        },
      },
    ])
  })

  config.plugin('injections').use(require('webpack/lib/DefinePlugin'), [
    {
      BASE_URL: JSON.stringify(base),
      NODE_ENV: JSON.stringify(env),
    },
  ])

  config.performance.hints(false)
  return config.toConfig() as Configuration
}
