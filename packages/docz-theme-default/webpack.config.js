const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const pkg = require('./package.json')
const ENV = process.env.NODE_ENV || 'development'
const IS_PROD = ENV === 'production'

const externalList = [
  'codemirror/mode/markdown/markdown',
  'codemirror/mode/javascript/javascript',
  'codemirror/mode/jsx/jsx',
  'codemirror/mode/css/css',
  'codemirror/addon/edit/matchbrackets',
  'codemirror/addon/edit/closetag',
  'codemirror/addon/fold/xml-fold',
  'polished/lib/color/rgba',
  'polished/lib/color/lighten',
  'polished/lib/color/darken',
  'polished/lib/mixins/placeholder',
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
  'react-feather/dist/icons/hash',
]

const internals = ['codemirror/lib/codemirror.css']

const deps = Object.keys(pkg.dependencies)
const externals = deps
  .concat(externalList)
  .filter(dep => internals.indexOf(dep) === -1)

const minify = new TerserPlugin({
  terserOptions: {
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
  parallel: true,
  cache: true,
  sourceMap: true,
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
    filename: 'index.js',
    libraryTarget: 'umd',
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
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
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
    alias: {
      '@ui': path.resolve(__dirname, 'src/components/ui'),
      '@shared': path.resolve(__dirname, 'src/components/shared'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  optimization: {
    nodeEnv: ENV,
    namedModules: true,
    ...(IS_PROD && {
      minimize: true,
      minimizer: [minify],
    }),
  },
  performance: {
    hints: false,
  },
}
