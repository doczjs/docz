import * as fs from 'fs'
import * as path from 'path'
import findup from 'find-up'
import { Loader, Configuration } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

import * as paths from './paths'
import { IEntryObj } from './files-parser'

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

export const createConfig = async (
  entries: IEntryObj[]
): Promise<Configuration> => {
  const babelrcPath = await findup('.babelrc')
  const babelrc = babelrcPath ? fs.readFileSync(babelrcPath, 'utf-8') : null

  return {
    mode: 'development',
    context: paths.ROOT,
    entry: [...entries.map(entry => entry.filepath), paths.INDEX_JS],
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
      modules: [paths.ROOT, 'node_modules'],
      alias: {
        src: path.join(paths.ROOT, 'src'),
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: paths.INDEX_HTML,
      }),
    ],
  }
}
