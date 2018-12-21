import Config from 'webpack-chain'
import { IgnorePlugin, HotModuleReplacementPlugin } from 'webpack'
import webpackBarPlugin from 'webpackbar'
import friendlyErrorsPlugin from 'friendly-errors-webpack-plugin'
import { minify } from 'html-minifier'
import miniHtmlWebpack from 'mini-html-webpack-plugin'
import manifestPlugin from 'webpack-manifest-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import * as paths from '../config/paths'
import { Config as Args, Env } from '../commands/args'
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

export const friendlyErrors = (config: Config, { host, port }: Args) => {
  const isLocalhost = host === '127.0.0.1' || host === '0.0.0.0'
  const hostname = isLocalhost ? 'localhost' : host

  config.plugin('friendly-errors').use(friendlyErrorsPlugin, [
    {
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
  const websocketUrl = `ws://${args.websocketHost}:${args.websocketPort}`
  const isDev = env !== 'production'

  config.plugin('injections').use(plugin, [
    {
      ...getClientEnvironment(base).stringified,
      NODE_ENV: stringify(env),
      DOCZ_BASE_URL: args.hashRouter ? stringify('/') : stringify(base),
      DOCZ_WEBSOCKET_URL: stringify(isDev && websocketUrl),
      DOCZ_HASH_ROUTER: stringify(args.hashRouter || false),
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
    .use(HotModuleReplacementPlugin as any, [])
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

export const webpackBar = (config: Config) => {
  config.plugin('webpackbar').use(webpackBarPlugin, [
    {
      color: '#41b883',
      compiledIn: false,
      name: 'Client',
    },
  ])
}
