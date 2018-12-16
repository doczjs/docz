import * as path from 'path'
import { Configuration } from 'webpack'
import Config from 'webpack-chain'

import * as loaders from './loaders'
import * as plugins from './plugins'
import * as paths from '../config/paths'
import { Config as Args, Env } from '../commands/args'
import { BabelRC } from '../utils/babel-config'
import { minifier } from './minifier'

export const createConfig = (args: Args, env: Env) => async (
  babelrc: BabelRC
): Promise<Configuration> => {
  const { debug } = args

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
   * entries
   */

  config
    .entry('app')
    .add(require.resolve('react-dev-utils/webpackHotDevClient'))
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

  if (args.typescript) {
    config.resolve.extensions
      .prepend('.ts')
      .prepend('.tsx')
      .end()
  }

  config.resolve.alias.set('~db', paths.db)
  config.resolve.alias.set('~imports', paths.importsJs)
  config.resolve.alias.set('react-native$', 'react-native-web')

  config.resolve.modules
    // prioritize our own
    .add(paths.ownNodeModules)
    .add(paths.appNodeModules)
    .add('node_modules')
    .add(srcPath)
    .add(paths.root)
    .merge([
      envDotProp
        .get('node.path')
        .split(path.delimiter)
        .filter(Boolean),
    ])

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

  await plugins.html(config, args, env)
  plugins.assets(config, args, env)
  plugins.ignore(config)
  plugins.injections(config, args, env)
  plugins.hot(config)

  config.when(debug, cfg => plugins.analyzer(cfg))
  config.when(!debug && !isProd, cfg => {
    plugins.webpackBar(cfg)
    plugins.friendlyErrors(cfg, args)
  })

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

  config.when(isProd, cfg => minifier(cfg))
  config.performance.hints(false)

  return config.toConfig() as Configuration
}
