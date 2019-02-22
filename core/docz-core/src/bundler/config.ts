import * as path from 'path'
import { Configuration } from 'webpack'
import * as envDotProp from 'env-dot-prop'
import Config from 'webpack-chain'

import * as loaders from './loaders'
import * as plugins from './plugins'
import * as paths from '../config/paths'
import { minifier } from './minifier'
import { ServerHooks as Hooks } from '../lib/Bundler'
import { Config as Args, Env } from '../config/argv'
import { getBabelConfig } from '../config/babel'

export const createConfig = (args: Args, env: Env) => async (hooks: Hooks) => {
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
    args.sourcemaps,
    cfg => cfg.devtool(isProd ? 'source-map' : 'cheap-module-eval-source-map'),
    cfg => cfg.devtool(false)
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
    .devtoolModuleFilenameTemplate((info: any) =>
      path.resolve(info.resourcePath).replace(/\\/g, '/')
    )

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

  config.resolve.alias.set('react-native$', 'react-native-web')

  const inYarnWorkspaces = __dirname.includes('/docz/core/docz-core')
  const doczDependenciesDir = inYarnWorkspaces
    ? path.join(__dirname, '../../../../node_modules')
    : paths.ownNodeModules

  config.resolve.modules
    .add('node_modules')
    .add(doczDependenciesDir)
    .add(srcPath)
    .add(paths.root)
    .merge(
      envDotProp
        .get('node.path')
        .split(path.delimiter)
        .filter(Boolean)
    )

  config.resolveLoader
    .set('symlinks', true)
    .modules // prioritize our own
    .add('node_modules')
    .add(doczDependenciesDir)
    .add(paths.root)

  /**
   * loaders
   */

  const jsBabelrc = await getBabelConfig(args, env)
  const tsBabelrc = await getBabelConfig(args, env, true)

  config.when(args.sourcemaps, cfg => loaders.sourceMaps(cfg, args))
  loaders.js(config, args, jsBabelrc)
  loaders.mdx(config, args, jsBabelrc)
  loaders.images(config)
  loaders.svg(config)
  loaders.media(config)
  loaders.fonts(config)

  await plugins.html(config, args, env)
  plugins.assets(config, args, env)
  plugins.ignore(config)
  plugins.injections(config, args, env)
  plugins.hot(config)

  config.when(debug, cfg => plugins.analyzer(cfg))
  config.when(!isProd, cfg => plugins.watchNodeModulesPlugin(cfg))
  config.when(!debug && !isProd, cfg => {
    plugins.webpackBar(cfg, args)
    plugins.friendlyErrors(cfg, args)
  })

  /**
   * typescript setup
   */

  config.when(args.typescript, cfg => {
    cfg.resolve.extensions
      .prepend('.ts')
      .prepend('.tsx')
      .end()

    loaders.ts(cfg, args, tsBabelrc)
  })

  /**
   * optimization
   */

  config.optimization
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

  config.performance.hints(false)
  config.when(isProd, cfg => minifier(cfg, args))
  hooks.onCreateWebpackChain<Config>(config, !isProd, args)
  args.onCreateWebpackChain<Config>(config, !isProd, args)

  return config.toConfig() as Configuration
}
