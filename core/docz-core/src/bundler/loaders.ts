import * as path from 'path'
import Config from 'webpack-chain'
import matter from 'remark-frontmatter'
import slug from 'rehype-slug'
import remarkDocz from 'remark-docz'
import rehypeDocz from 'rehype-docz'

import * as paths from '../config/paths'
import { Config as Args } from '../config/argv'
import { BabelRC } from '../config/babel'

const outsideNodeModules = (filepath: string) => !/node_modules/.test(filepath)
const excludeNodeModules = (filepath: string) => /node_modules/.test(filepath)

export const sourceMaps = (config: Config) => {
  config.module
    .rule('sourcemaps')
    .test(/\.(js|mjs|jsx|ts|tsx|md|mdx)$/)
    .include.add(outsideNodeModules)
    .end()
    .use('sourcemaps')
    .loader(require.resolve('source-map-loader'))
    .end()
    .enforce('pre')
}

export const js = (config: Config, args: Args, babelrc: BabelRC) => {
  const srcPath = path.resolve(paths.root, args.src)

  config.module
    .rule('js')
    .test(/\.(js|mjs|jsx|ts|tsx)$/)
    .include.add(srcPath)
    .add(paths.docz)
    .end()
    .exclude.add(excludeNodeModules)
    .end()
    .use('thread-loader')
    .loader(require.resolve('thread-loader'))
    .end()
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .options(babelrc)
    .end()
}

export const mdx = (config: Config, args: Args, babelrc: BabelRC) => {
  const { mdPlugins, hastPlugins } = args
  const srcPath = path.resolve(paths.root, args.src)

  config.module
    .rule('mdx')
    .test(/\.(md|markdown|mdx)$/)
    .include.add(srcPath)
    .add(paths.root)
    .add(paths.docz)
    .end()
    .exclude.add(excludeNodeModules)
    .end()
    .use('thread-loader')
    .loader(require.resolve('thread-loader'))
    .end()
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .options(babelrc)
    .end()
    .use('mdx-loader')
    .loader(require.resolve('@mdx-js/loader'))
    .options({
      type: 'yaml',
      marker: '-',
      mdPlugins: mdPlugins.concat([matter, remarkDocz]),
      hastPlugins: hastPlugins.concat([
        rehypeDocz(paths.root, args.codeSandbox),
        slug,
      ]),
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
