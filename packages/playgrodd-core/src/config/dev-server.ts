import { Application } from 'express'
import * as errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware'
import * as paths from './paths'

export const PORT = 3000
export const PROTOCOL = process.env.HTTPS === 'true' ? 'https' : 'http'
export const HOST = process.env.HOST || '0.0.0.0'

export const devServerConfig = () => ({
  compress: true,
  clientLogLevel: 'none',
  contentBase: paths.PLAYGRODD,
  watchContentBase: true,
  hot: true,
  quiet: true,
  noInfo: true,
  publicPath: '/',
  https: PROTOCOL === 'https',
  host: HOST,
  overlay: false,
  watchOptions: {
    ignored: /node_modules/,
  },
  stats: {
    colors: true,
    chunks: false,
    chunkModules: false,
  },
  historyApiFallback: {
    disableDotRule: true,
  },
  before(app: Application) {
    app.use(errorOverlayMiddleware())
  },
})
