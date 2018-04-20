import { ConfigArgs } from 'docz'
import { Application } from 'express'
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware'

export const devServerConfig = ({
  paths,
  host,
  debug,
  protocol,
}: ConfigArgs) => ({
  host,
  before(app: Application): void {
    !debug && app.use(errorOverlayMiddleware())
  },
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
