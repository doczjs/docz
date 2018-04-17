import { ConfigArgs } from 'docz-core'
import { Application } from 'express'
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware'

export const devServerConfig = ({ paths, host, protocol }: ConfigArgs) => ({
  host,
  before(app: Application): void {
    app.use(errorOverlayMiddleware())
  },
  clientLogLevel: 'none',
  compress: true,
  contentBase: paths.docz,
  historyApiFallback: {
    disableDotRule: true,
  },
  hot: true,
  https: protocol === 'https',
  noInfo: true,
  overlay: false,
  publicPath: '/',
  quiet: true,
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
