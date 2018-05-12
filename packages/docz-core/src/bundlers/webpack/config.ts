import * as path from 'path'
import * as webpack from 'webpack'
import { Configuration } from 'webpack'
import { load } from 'load-cfg'
import merge from 'deepmerge'
import Webpackbar from 'webpackbar'
import Config from 'webpack-chain'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import friendlyErrors from 'friendly-errors-webpack-plugin'
import HappyPack from 'happypack'

import { Config as ConfigObj } from '../../commands/args'
import { plugin as mdastPlugin } from '../../utils/plugin-mdast'
import { plugin as hastPlugin } from '../../utils/plugin-hast'

const INLINE_LIMIT = 10000

const babelrc = merge(load('babel', null), {
  babelrc: false,
  cacheDirectory: true,
  presets: [require.resolve('babel-preset-react-app')],
  plugins: [],
})

interface HappypackLoaderParams {
  id: string
  plugins?: any[]
}

const happypackLoader = ({
  id,
  plugins = babelrc.plugins,
}: HappypackLoaderParams) => [
  {
    id,
    threads: 2,
    loaders: [
      {
        loader: require.resolve('babel-loader'),
        query: {
          ...babelrc,
          plugins,
        },
      },
    ],
  },
]

export const createConfig = (args: ConfigObj) => (): Configuration => {
  const { paths, env, debug } = args

  const srcPath = path.resolve(paths.root, args.src)
  const isProd = env === 'production'
  const config = new Config()

  /**
   * general
   */
  config.context(paths.root)
  config.set('mode', isProd && !debug ? 'production' : 'development')

  config.when(debug, cfg => cfg.devtool('source-map'))
  config.when(!isProd, cfg => cfg.devtool('cheap-module-eval-source-map'))

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
      .filename('static/js/[name].[chunkhash:8].js')
      .sourceMapFilename('static/js/[name].[chunkhash:8].js.map')
      .publicPath(paths.servedPath)

  const outputDev = (output: Config.Output) =>
    output
      .filename('static/js/[name].js')
      .sourceMapFilename('static/js/[name].js.map')
      .publicPath('/')

  config.output
    .pathinfo(true)
    .path(paths.dist)
    .when(isProd, outputProd, outputDev)
    .crossOriginLoading('anonymous')

  /**
   * entries
   */

  config
    .entry('app')
    .add(require.resolve('babel-polyfill'))
    .add(paths.indexJs)

  /**
   * resolve
   */

  config.resolve
    .set('symlinks', true)
    .alias.set(
      '@babel/runtime',
      path.dirname(require.resolve('@babel/runtime/package.json'))
    )

  config.resolve.extensions
    .merge(['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx', '.mdx'])
    .end()
    .modules.add('node_modules')
    .add(srcPath)

  config.resolveLoader
    .set('symlinks', true)
    .modules.add('node_modules')
    .add(paths.root)

  /**
   * loaders
   */

  config.module
    .rule('js')
    .test(/\.js?x$/)
    .include.add(srcPath)
    .add(paths.docz)
    .end()
    .exclude.add(/node_modules/)
    .end()
    .use('happypack-jsx')
    .loader('happypack/loader?id=jsx')

  config.module
    .rule('mdx')
    .test(/\.md?x$/)
    .include.add(srcPath)
    .add(paths.docz)
    .end()
    .exclude.add(/node_modules/)
    .end()
    .use('happypack-mdx')
    .loader('happypack/loader?id=mdx')
    .end()
    .use('mdx-loader')
    .loader(require.resolve('@mdx-js/loader'))
    .options({
      mdPlugins: args.mdPlugins.concat([mdastPlugin]),
      hastPlugins: args.hastPlugins.concat([hastPlugin]),
    })

  const jsx = happypackLoader({
    id: 'jsx',
    plugins: babelrc.plugins.concat([
      require.resolve('react-hot-loader/babel'),
      require.resolve('babel-plugin-react-docgen'),
    ]),
  })

  const mdx = happypackLoader({
    id: 'mdx',
  })

  config.plugin('happypack-jsx').use(HappyPack, jsx)
  config.plugin('happypack-mdx').use(HappyPack, mdx)

  config.module
    .rule('images')
    .test(/\.(png|jpe?g|gif)(\?.*)?$/)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options({
      limit: INLINE_LIMIT,
      name: `static/img/[name].[hash:8].[ext]`,
    })

  config.module
    .rule('svg')
    .test(/\.(svg)(\?.*)?$/)
    .use('file-loader')
    .loader(require.resolve('file-loader'))
    .options({
      name: `static/img/[name].[hash:8].[ext]`,
    })

  config.module
    .rule('media')
    .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options({
      limit: INLINE_LIMIT,
      name: `static/media/[name].[hash:8].[ext]`,
    })

  config.module
    .rule('fonts')
    .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .options({
      limit: INLINE_LIMIT,
      name: `static/fonts/[name].[hash:8].[ext]`,
    })

  config
    .plugin('named-modules-plugin')
    .use(webpack.NamedModulesPlugin)
    .end()
    .plugin('no-emit-errors')
    .use(webpack.NoEmitOnErrorsPlugin)
    .end()
    .plugin('html-webpack-plugin')
    .use(HtmlWebpackPlugin, [
      {
        inject: true,
        template: paths.indexHtml,
      },
    ])

  config.when(!debug, cfg => {
    cfg.plugin('webpackbar').use(Webpackbar, [
      {
        color: '#41b883',
        compiledIn: false,
        name: 'Client',
      },
    ])
    cfg.plugin('friendly-errors').use(friendlyErrors)
  })

  return config.toConfig()
}
