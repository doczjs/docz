import * as path from 'path'
import HappyPack from 'happypack'

import Config from 'webpack-chain'
import { Config as Args } from '../../commands/args'
import * as paths from '../../config/paths'
import * as mdxConfig from '../../config/mdx'

export const setupHappypack = (config: Config, args: Args, babelrc: any) => {
  const jsx = {
    id: 'jsx',
    verbose: args.debug,
    loaders: [
      {
        loader: require.resolve('babel-loader'),
        options: babelrc,
      },
    ] as any[],
  }

  if (args.propsParser && args.typescript) {
    jsx.loaders.push({
      loader: require.resolve('react-docgen-typescript-loader'),
    })
  }

  const mdx = {
    id: 'mdx',
    verbose: args.debug,
    loaders: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          ...babelrc,
          plugins: babelrc.plugins
            .filter((p: string) => /react\-hot\-loader\/babel/.test(p))
            .filter((p: string) => /babel\-plugin\-react\-docgen/.test(p)),
        },
      },
    ],
  }

  config.plugin('happypack-jsx').use(HappyPack, [jsx])
  config.plugin('happypack-mdx').use(HappyPack, [mdx])
}

export const js = (config: Config, args: Args) => {
  const srcPath = path.resolve(paths.root, args.src)

  config.module
    .rule('js')
    .test(/\.(js|jsx|mjs)$/)
    .include.add(srcPath)
    .add(paths.docz)
    .end()
    .exclude.add(/node_modules/)
    .end()
    .use('happypack-jsx')
    .loader('happypack/loader?id=jsx')
}

export const ts = (config: Config, args: Args) => {
  const srcPath = path.resolve(paths.root, args.src)

  config.module
    .rule('ts')
    .test(/\.(ts|tsx)$/)
    .include.add(srcPath)
    .end()
    .exclude.add(/node_modules/)
    .end()
    .use('happypack-jsx')
    .loader('happypack/loader?id=jsx')
}

export const mdx = (config: Config, args: Args) => {
  const { mdPlugins, hastPlugins } = args
  const srcPath = path.resolve(paths.root, args.src)

  config.module
    .rule('mdx')
    .test(/\.md?x$/)
    .include.add(srcPath)
    .end()
    .exclude.add(/node_modules/)
    .end()
    .use('happypack-mdx')
    .loader('happypack/loader?id=mdx')
    .end()
    .use('mdx-loader')
    .loader(require.resolve('@mdx-js/loader'))
    .options({
      ...mdxConfig.config,
      mdPlugins: mdPlugins.concat(mdxConfig.remarkPlugins),
      hastPlugins: hastPlugins.concat(mdxConfig.rehypePlugins),
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
