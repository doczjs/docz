import * as paths from './paths'

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
const host = process.env.HOST || '0.0.0.0'

export const config = (compiler: any) => ({
  compress: true,
  clientLogLevel: 'none',
  contentBase: paths.DIST,
  watchContentBase: true,
  publicPath: '/',
  hot: true,
  quiet: true,
  noInfo: true,
  https: protocol === 'https',
  host: host,
  overlay: false,
  watchOptions: {
    ignored: /node_modules/,
  },
  stats: {
    colors: true,
    chunks: false,
    chunkModules: false,
  },
})
