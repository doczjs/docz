import { createPlugin } from 'docz-core'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import merge from 'deepmerge'

import { getLocalIdent } from './get-local-ident'

/**
 * Tests
 */

type PreProcessor = 'postcss' | 'sass' | 'less' | 'stylus'
const tests: Record<PreProcessor, RegExp> = {
  postcss: /(\.module)?\.css$/,
  sass: /(\.module)?\.s(a|c)ss$/,
  less: /(\.module)?\.less$/,
  stylus: /(\.module)?\.styl(us)?$/,
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

  const loaderfn = loaders[preprocessor]
  const loader = loaderfn(loaderOpts)
  const cssoptions = merge(cssOpts, {
    importLoaders: 1,
    modules: cssmodules,
    sourceMap: !dev,
    ...(cssmodules && { getLocalIdent }),
  })

  return {
    test: tests[preprocessor],
    exclude: [/node_modules/],
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
      config.module.rules.push(applyRule(opts, opts.cssmodules, dev))

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
