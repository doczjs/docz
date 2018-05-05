import { Config } from '../../commands/args'

export const devServerConfig = ({ paths, host, debug, protocol }: Config) => ({
  host,
  clientLogLevel: !debug ? 'none' : 'error',
  compress: true,
  contentBase: paths.docz,
  historyApiFallback: {
    disableDotRule: true,
  },
  hot: true,
  https: protocol === 'https',
  noInfo: !debug,
  overlay: false,
  publicPath: '/',
  quiet: !debug,
  stats: {
    chunkModules: false,
    chunks: false,
    colors: true,
  },
  watchContentBase: true,
  watchOptions: {
    ignored: /node_modules/,
  },
})
