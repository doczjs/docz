const path = require('path')
const webpack = require('webpack')
const UglifyJs = require('uglifyjs-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const pkg = require('./package.json')
const ENV = process.env.NODE_ENV || 'development'
const IS_PROD = ENV === 'production'

const externalList = [
  '@mdx-js/tag',
  'codemirror',
  'codemirror/mode/markdown/markdown',
  'codemirror/mode/javascript/javascript',
  'codemirror/mode/jsx/jsx',
  'codemirror/mode/css/css',
  'codemirror/addon/edit/matchbrackets',
  'polished/lib/color/rgba',
  'polished/lib/color/lighten',
  'polished/lib/color/darken',
  'react-codemirror2',
  'react-dom/server',
  'react-feather',
  'react-feather/dist/icons/edit-2',
  'react-feather/dist/icons/chevron-down',
  'react-feather/dist/icons/search',
  'react-feather/dist/icons/clipboard',
  'react-feather/dist/icons/check',
  'react-feather/dist/icons/smartphone',
  'react-feather/dist/icons/tablet',
  'react-feather/dist/icons/monitor',
  'react-feather/dist/icons/maximize',
  'react-feather/dist/icons/minimize',
  'react-feather/dist/icons/refresh-cw',
]

const deps = Object.keys(pkg.dependencies)
const externals = Object.keys(pkg.dependencies)
  .concat(externalList)
  .concat(deps.filter(dep => dep.startsWith('react-feather')))

const uglify = new UglifyJs({
  parallel: true,
  cache: true,
  sourceMap: true,
  uglifyOptions: {
    parse: {
      ecma: 8,
    },
    compress: {
      ecma: 5,
      warnings: false,
      comparisons: false,
    },
    mangle: {
      safari10: true,
    },
    output: {
      ecma: 5,
      comments: false,
      ascii_only: true,
    },
  },
})

const plugins = [
  new FileManagerPlugin({
    onStart: [{ delete: ['./dist'] }],
  }),
  new BundleAnalyzerPlugin({
    openAnalyzer: false,
    analyzerMode: 'static',
  }),
]

module.exports = {
  externals,
  plugins: IS_PROD ? plugins : [],
  mode: IS_PROD ? 'production' : 'development',
  entry: path.join(__dirname, '/src/index.tsx'),
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: `index.js`,
    library: 'DoczThemeDefault',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /(\.ts|\.tsx)$/,
        exclude: /node_modules/,
        loader: [
          { loader: 'babel-loader' },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.json', '.js', '.ts', '.tsx'],
    modules: [
      path.resolve('./node_modules'),
      path.resolve('../../node_modules'),
      path.resolve('./src'),
    ],
  },
  optimization: {
    nodeEnv: ENV,
    namedModules: true,
    ...(IS_PROD && {
      minimize: true,
      minimizer: [uglify],
    }),
  },
  performance: {
    hints: false,
  },
}
