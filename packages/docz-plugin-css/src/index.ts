import { createPlugin } from 'docz-core'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import merge from 'deepmerge'

import { getLocalIdent } from './get-local-ident'

/**
 * Tests
 */

const tests: Record<string, RegExp> = {
  postcss: /\.css$/,
  'module-postcss': /\.module\.css$/,
  sass: /\.s(a|c)ss$/,
  'module-sass': /\.module\.s(a|c)ss$/,
  less: /\.less$/,
  'module-less': /\.module\.less$/,
  stylus: /\.styl(us)?$/,
  'module-stylus': /\.module\.styl(us)?$/,
}

/**
 * Loaders
 */

export interface Opts {
  [key: string]: any
}

const getStyleLoaders = (loader: any, opts: Opts) => (
  cssopts: any,
  dev: boolean
) => {
  return [
    {
      loader: dev
        ? require.resolve('style-loader')
        : MiniCssExtractPlugin.loader,
    },
    {
      loader: require.resolve('css-loader'),
      options: cssopts,
    },
    {
      loader,
      options: opts,
    },
  ]
}

const loaders = {
  postcss: (opts: Opts = { plugins: [] }) =>
    getStyleLoaders(require.resolve('postcss-loader'), {
      plugins: () =>
        opts.plugins.concat([
          require('postcss-flexbugs-fixes'),
          require('autoprefixer')({
            flexbox: 'no-2009',
          }),
        ]),
    }),

  sass: (opts: Opts = {}) =>
    getStyleLoaders(
      require.resolve('sass-loader'),
      merge(opts, { indentedSyntax: false })
    ),

  less: (opts: Opts = {}) =>
    getStyleLoaders(require.resolve('less-loader'), opts),

  stylus: (opts: Opts = {}) =>
    getStyleLoaders(
      require.resolve('stylus-loader'),
      merge(opts, { preferPathResolver: 'webpack' })
    ),
}

/**
 * Rules
 */

const applyRule = (
  opts: CSSPluginOptions,
  cssmodules: boolean | undefined,
  dev: boolean
) => {
  const { preprocessor = 'postcss', cssOpts, loaderOpts } = opts

  const regexp = tests[preprocessor]
  const modulesRegexp = tests[`module-${preprocessor}`]
  const test = cssmodules ? modulesRegexp : regexp
  const exclude = [/node_modules/]

  const loaderfn = loaders[preprocessor]
  const loader = loaderfn(loaderOpts)
  const cssoptions = merge(cssOpts, {
    importLoaders: 1,
    modules: cssmodules,
    sourceMap: !dev,
    ...(cssmodules && { getLocalIdent }),
  })

  return {
    test,
    exclude: cssmodules ? exclude : exclude.concat([modulesRegexp]),
    use: loader(cssoptions, dev),
  }
}

export interface CSSPluginOptions {
  preprocessor?: 'postcss' | 'sass' | 'less' | 'stylus'
  cssmodules?: boolean
  loaderOpts?: Opts
  cssOpts?: Opts
}

export const css = (opts: CSSPluginOptions) =>
  createPlugin({
    modifyBundlerConfig: (config, dev) => {
      config.module.rules.push(
        applyRule(opts, false, dev),
        applyRule(opts, opts.cssmodules, dev)
      )

      if (!dev) {
        const test = tests[opts.preprocessor || 'postcss']
        const minimizer = config.optimization.minimizer || []
        const splitChunks = { ...config.optimization.splitChunks }

        config.optimization.minimizer = minimizer.concat([
          new OptimizeCSSAssetsPlugin({}),
        ])

        config.optimization.splitChunks = merge(splitChunks, {
          cacheGroups: {
            styles: {
              test: (m: any) => test.test(m.type),
              name: 'styles',
              chunks: 'all',
              enforce: true,
            },
          },
        })

        config.plugins.push(
          new MiniCssExtractPlugin({
            filename: 'static/css/[name].[hash].css',
          })
        )
      }

      return config
    },
  })
