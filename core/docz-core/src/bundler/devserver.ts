import * as path from 'path'
import * as express from 'express'
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware'
import evalSourceMapMiddleware from 'react-dev-utils/evalSourceMapMiddleware'
import ignoredFiles from 'react-dev-utils/ignoredFiles'

import * as paths from '../config/paths'
import { Config as Args } from '../config/argv'
import { ServerHooks } from '../lib/Bundler'

export const devServerConfig = (hooks: ServerHooks, args: Args) => {
  const srcPath = path.resolve(paths.root, args.src)
  const publicDir = path.resolve(paths.root, args.public)
  const nonExistentDir = path.resolve(__dirname, 'non-existent')

  return {
    publicPath: '/',
    compress: true,
    logLevel: args.debug ? 'debug' : 'silent',
    clientLogLevel: args.debug ? 'info' : 'none',
    contentBase: [nonExistentDir],
    watchContentBase: true,
    hot: true,
    quiet: !args.debug,
    open: args.open,
    watchOptions: {
      ignored: ignoredFiles(srcPath),
    },
    overlay: false,
    host: args.host,
    port: args.port,
    historyApiFallback: {
      disableDotRule: true,
    },
    disableHostCheck: true,
    before(app: any, server: any): void {
      app.use('/public', express.static(publicDir))
      app.use(evalSourceMapMiddleware(server))
      app.use(errorOverlayMiddleware())
      hooks.onPreCreateApp<any>(app)
    },
    after(app: any): void {
      hooks.onCreateApp<any>(app)
    },
  }
}
