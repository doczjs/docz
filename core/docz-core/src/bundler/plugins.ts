import Config from 'webpack-chain'
import { IgnorePlugin, HotModuleReplacementPlugin } from 'webpack'
import webpackBarPlugin from 'webpackbar'
import friendlyErrorsPlugin from 'friendly-errors-webpack-plugin'
import { minify } from 'html-minifier'
import miniHtmlWebpack from 'mini-html-webpack-plugin'
import manifestPlugin from 'webpack-manifest-plugin'
import watchMissingNodeModules from 'react-dev-utils/WatchMissingNodeModulesPlugin'
import moduleNotFoundPlugin from 'react-dev-utils/ModuleNotFoundPlugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import * as paths from '../config/paths'
import { Config as Args, Env } from '../config/argv'
import { getClientEnvironment } from '../config/env'
import { parseHtml, htmlTemplate } from '../utils/parse-html'

export const assets = (config: Config, args: Args, env: Env) => {
  const isProd = env === 'production'
  const base = paths.servedPath(args.base)
  const publicPath = isProd ? base : '/'

  config.plugin('assets-plugin').use(manifestPlugin, [
    {
      publicPath,
      fileName: 'assets.json',
    },
  ])
}

export const analyzer = (config: Config) => {
  config.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [
    {
      generateStatsFile: true,
      openAnalyzer: false,
      analyzerMode: 'static',
    },
  ])
}

export const friendlyErrors = (config: Config, args: Args) => {
  const { host, port, clearConsole } = args
  const isLocalhost = host === '127.0.0.1' || host === '0.0.0.0'
  const hostname = isLocalhost ? 'localhost' : host

  config.plugin('friendly-errors').use(friendlyErrorsPlugin, [
    {
      clearConsole,
      compilationSuccessInfo: {
        messages: [`Your application is running at http://${hostname}:${port}`],
      },
    },
  ])
}

export const injections = (config: Config, args: Args, env: Env) => {
  const { stringify } = JSON
  const base = paths.servedPath(args.base)
  const plugin = require('webpack/lib/DefinePlugin')

  config.plugin('injections').use(plugin, [
    {
      ...getClientEnvironment(base).stringified,
      NODE_ENV: stringify(env),
      DOCZ_BASE_URL: stringify(base),
    },
  ])
}

export const ignore = (config: Config) => {
  config
    .plugin('ignore-plugin')
    .use(IgnorePlugin as any, [
      /(regenerate\-unicode\-properties)|(elliptic)/,
      /node_modules/,
    ])
}

export const hot = (config: Config) => {
  config
    .plugin('hot-module-replacement')
    .use(HotModuleReplacementPlugin as any, [
      {
        multiStep: true,
      },
    ])
}

export const html = async (config: Config, args: Args, env: Env) => {
  const dev = env !== 'production'
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
}

export const webpackBar = (config: Config, args: Args) => {
  config.plugin('webpackbar').use(webpackBarPlugin, [
    {
      name: 'Docz',
      color: '#41b883',
    },
  ])
}

export const watchNodeModulesPlugin = (config: Config) => {
  config
    .plugin('watch-missing-node-modules')
    .use(watchMissingNodeModules, [paths.appNodeModules])
}

export const notFoundPlugin = (config: Config) => {
  config.plugin('not-found-plugin').use(moduleNotFoundPlugin, [paths.root])
}
