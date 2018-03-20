import * as fs from 'fs'
import * as path from 'path'
import findup from 'find-up'
import webpack, { Loader, Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

import { IComponentMap } from '../utils/components'
import * as paths from './paths'

export { config as devServerConfig } from './dev-server'

const babelLoader = (babelrc: string | null): Loader => ({
  loader: require.resolve('babel-loader'),
  options: babelrc
    ? JSON.parse(babelrc)
    : {
        babelrc: false,
        cacheDirectory: true,
        presets: [
          require.resolve('@babel/preset-env'),
          require.resolve('@babel/preset-react'),
        ],
      },
})

export const config = async (
  components: IComponentMap
): Promise<Configuration> => {
  const babelrcPath = await findup('.babelrc')
  const babelrc = babelrcPath ? fs.readFileSync(babelrcPath, 'utf-8') : null

  return {
    mode: 'development',
    context: paths.ROOT,
    entry: [
      ...Object.values(components).map(({ filepath: f }) => f),
      paths.INDEX_JS,
    ],
    output: {
      pathinfo: true,
      path: paths.DIST,
      publicPath: '/',
      filename: 'static/js/[name].js',
      sourceMapFilename: 'static/js/[name].js.map',
      crossOriginLoading: 'anonymous',
      devtoolModuleFilenameTemplate: (info: any) =>
        path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          include: [paths.ROOT],
          use: babelLoader(babelrc),
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
    plugins: [
      new webpack.DefinePlugin({
        __PLAYGRODD_COMPONENTS__: JSON.stringify(components),
      }),
      new HtmlWebpackPlugin({
        template: paths.INDEX_HTML,
      }),
    ],
  }
}
