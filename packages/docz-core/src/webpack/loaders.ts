import * as path from 'path'
import HappyPack from 'happypack'

import Config from 'webpack-chain'
import { Config as Args } from '../commands/args'
import * as paths from '../config/paths'
import * as mdxConfig from '../config/mdx'

export const sourceMaps = (config: Config, args: Args) => {
  const srcPath = path.resolve(paths.root, args.src)

  config.module
    .rule('sourcemaps')
    .test(/\.(js|mjs|jsx|ts|tsx|md|mdx)$/)
    .include.add(srcPath)
    .add(paths.root)
    .add(paths.docz)
    .end()
    .exclude.add(/node_modules/)
    .end()
    .use('sourcemaps')
    .loader(require.resolve('source-map-loader'))
    .end()
    .enforce('pre')
}

export const js = (config: Config, args: Args) => {
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
    .use('happypack-jsx')
    .loader('happypack/loader?id=jsx')
    .end()
    .when(args.propsParser && args.typescript, rule =>
      rule.use(require.resolve('react-docgen-typescript-loader'))
    )
}

export const mdx = (config: Config, args: Args) => {
  const { mdPlugins, hastPlugins } = args
  const srcPath = path.resolve(paths.root, args.src)

  config.module
    .rule('mdx')
    .test(/\.(md|markdown|mdx)$/)
    .include.add(srcPath)
    .end()
    .exclude.add(/node_modules/)
    .end()
    .use('happypack-mdx')
    .loader('happypack/loader?id=jsx')
    .end()
    .use('mdx-loader')
    .loader(require.resolve('@mdx-js/loader'))
    .options({
      ...mdxConfig.config,
      mdPlugins: mdPlugins.concat(mdxConfig.remarkPlugins()),
      hastPlugins: hastPlugins.concat(mdxConfig.rehypePlugins(args)),
    })
}

export const setupHappypack = (config: Config, args: Args, babelrc: any) => {
  config.plugin('happypack-jsx').use(HappyPack, [
    {
      id: 'jsx',
      verbose: args.debug,
      loaders: [
        !args.debug && {
          loader: require.resolve('cache-loader'),
          options: {
            cacheDirectory: paths.cache,
          },
        },
        {
          loader: require.resolve('babel-loader'),
          options: babelrc,
        },
      ].filter(Boolean),
    },
  ])
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
