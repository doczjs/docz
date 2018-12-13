import * as path from 'path'
import { Configuration, IgnorePlugin } from 'webpack'
import webpackBarPlugin from 'webpackbar'
import Config from 'webpack-chain'
import { minify } from 'html-minifier'
import miniHtmlWebpack from 'mini-html-webpack-plugin'
import friendlyErrors from 'friendly-errors-webpack-plugin'
import manifestPlugin from 'webpack-manifest-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import * as TerserPlugin from 'terser-webpack-plugin'

import * as loaders from './loaders'
import * as paths from '../config/paths'
import { getClientEnvironment } from '../config/env'
import { Config as Args, Env } from '../commands/args'
import { BabelRC } from '../utils/babel-config'
import { parseHtml, htmlTemplate } from '../utils/parse-html'

export const createConfig = (args: Args, env: Env) => async (
  babelrc: BabelRC
): Promise<Configuration> => {
  const { debug, host, port } = args

  const config = new Config()
  const isProd = env === 'production'
  const base = paths.servedPath(args.base)
  const dist = paths.getDist(args.dest)
  const srcPath = path.resolve(paths.root, args.src)
  const publicPath = isProd ? base : '/'

  /**
   * general
   */
  config.context(paths.root)
  config.set('mode', env)

  config.when(
    isProd,
    cfg => cfg.devtool('source-map'),
    cfg => cfg.devtool('cheap-module-eval-source-map')
  )

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

  const outputDev = (output: Config.Output) =>
    output
      .filename('static/js/[name].js')
      .sourceMapFilename('static/js/[name].js.map')

  config.output
    .pathinfo(true)
    .path(path.resolve(paths.root, dist))
    .publicPath(publicPath)
    .when(isProd, outputProd, outputDev)
    .crossOriginLoading('anonymous')

  /**
   * optimization
   */

  config.optimization
    .runtimeChunk(true)
    .nodeEnv(env)
    .namedModules(true)
    .minimize(isProd)
    .splitChunks({
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    })

  /** TODO: this is needed because incorrect typing on webpack-chain */
  const optimization: any = config.optimization

  if (isProd) {
    optimization.minimizer('js').use(TerserPlugin, [
      {
        terserOptions: {
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
        cache: true,
        parallel: true,
        sourceMap: true,
      },
    ])
  }

  /**
   * entries
   */

  config
    .entry('app')
    .add(require.resolve('@babel/polyfill'))
    .add(paths.indexJs)

  /**
   * resolve
   */

  config.resolve.set('symlinks', true)
  config.resolve.extensions
    .add('.web.js')
    .add('.mjs')
    .add('.js')
    .add('.json')
    .add('.web.jsx')
    .add('.jsx')
    .add('.mdx')
    .end()

  config.resolve.alias.set('~db', paths.db)
  config.resolve.alias.set('~imports', paths.importsJs)
  config.resolve.alias.set('react-native$', 'react-native-web')

  if (args.typescript) {
    config.resolve.extensions
      .prepend('.ts')
      .prepend('.tsx')
      .end()
  }

  config.resolve.modules
    // prioritize our own
    .add(paths.ownNodeModules)
    .add(paths.appNodeModules)
    .add('node_modules')
    .add(srcPath)
    .add(paths.root)

  config.resolveLoader
    .set('symlinks', true)
    .modules // prioritize our own
    .add(paths.ownNodeModules)
    .add(paths.appNodeModules)
    .add('node_modules')
    .add(paths.root)

  /**
   * loaders
   */

  loaders.sourceMaps(config, args)
  loaders.js(config, args)
  loaders.mdx(config, args)
  loaders.images(config)
  loaders.svg(config)
  loaders.media(config)
  loaders.fonts(config)
  loaders.setupHappypack(config, args, babelrc)

  /**
   * plugins
   */

  if (debug) {
    config.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [
      {
        generateStatsFile: true,
        openAnalyzer: false,
      },
    ])
  }

  config.plugin('assets-plugin').use(manifestPlugin, [
    {
      publicPath,
      fileName: 'assets.json',
    },
  ])

  const dev = !isProd
  const template = await htmlTemplate(args.indexHtml)

  config.plugin('html-plugin').use(miniHtmlWebpack, [
    {
      context: {
        ...args.htmlContext,
        trimWhitespace: true,
      },
      template: (ctx: any) => {
        const doc = parseHtml({ ctx, dev, template, config: args })

        return dev
          ? doc
          : minify(doc, {
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
            })
      },
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
            `Your application is running at http://${hostname}:${port}`,
          ],
        },
      },
    ])
  })

  config.plugin('injections').use(require('webpack/lib/DefinePlugin'), [
    {
      ...getClientEnvironment(base).stringified,
      BASE_URL: args.hashRouter ? JSON.stringify('/') : JSON.stringify(base),
      NODE_ENV: JSON.stringify(env),
    },
  ])

  config
    .plugin('ignore-plugin')
    .use(IgnorePlugin as any, [
      /(regenerate\-unicode\-properties)|(elliptic)/,
      /node_modules/,
    ])

  config.performance.hints(false)
  return config.toConfig() as Configuration
}
