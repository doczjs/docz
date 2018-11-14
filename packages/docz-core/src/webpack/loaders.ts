import * as path from 'path'

import Config from 'webpack-chain'
import { Config as Args } from '../commands/args'
import * as paths from '../config/paths'
import * as mdxConfig from '../config/mdx'

const addCacheLoader = (rule: Config.Rule) =>
  rule
    .use('cache-loader')
    .loader(require.resolve('cache-loader'))
    .options({ cacheDirectory: paths.cache })

const addTypescriptDocgen = (rule: Config.Rule) =>
  rule
    .use('typescript-docgen')
    .loader(require.resolve('react-docgen-typescript-loader'))

export const js = (config: Config, args: Args, babelrc: any) => {
  const srcPath = path.resolve(paths.root, args.src)

  config.module
    .rule('js')
    .test(/\.(js|mjs|jsx|ts|tsx)$/)
    .include.add(srcPath)
    .add(paths.root)
    .add(paths.docz)
    .end()
    .exclude.add(/node_modules/)
    .end()
    .when(args.debug, addCacheLoader)
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .options(babelrc)
    .end()
    .when(args.propsParser && args.typescript, addTypescriptDocgen)
}

export const mdx = (config: Config, args: Args, babelrc: any) => {
  const { mdPlugins, hastPlugins } = args
  const srcPath = path.resolve(paths.root, args.src)

  config.module
    .rule('mdx')
    .test(/\.(md|markdown|mdx)$/)
    .include.add(srcPath)
    .end()
    .exclude.add(/node_modules/)
    .end()
    .when(args.debug, addCacheLoader)
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .options(babelrc)
    .end()
    .use('mdx-loader')
    .loader(require.resolve('@mdx-js/loader'))
    .options({
      ...mdxConfig.config,
      mdPlugins: mdPlugins.concat(mdxConfig.remarkPlugins()),
      hastPlugins: hastPlugins.concat(mdxConfig.rehypePlugins(args)),
    })
}

const INLINE_LIMIT = 10000

export const images = (config: Config) => {
  config.module
    .rule('images')
    .test(/\.(png|jpe?g|gif)(\?.*)?$/)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options({
      limit: INLINE_LIMIT,
      name: `static/img/[name].[hash:8].[ext]`,
    })
}

export const svg = (config: Config) => {
  config.module
    .rule('svg')
    .test(/\.(svg)(\?.*)?$/)
    .use('file-loader')
    .loader(require.resolve('file-loader'))
    .options({
      name: `static/img/[name].[hash:8].[ext]`,
    })
}

export const media = (config: Config) => {
  config.module
    .rule('media')
    .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options({
      limit: INLINE_LIMIT,
      name: `static/media/[name].[hash:8].[ext]`,
    })
}

export const fonts = (config: Config) => {
  config.module
    .rule('fonts')
    .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options({
      limit: INLINE_LIMIT,
      name: `static/fonts/[name].[hash:8].[ext]`,
    })
}
