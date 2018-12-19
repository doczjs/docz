import * as path from 'path'
import * as express from 'express'
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware'
import evalSourceMapMiddleware from 'react-dev-utils/evalSourceMapMiddleware'
import ignoredFiles from 'react-dev-utils/ignoredFiles'

import * as paths from '../config/paths'
import { Config as Args } from '../commands/args'
import { ServerHooks } from '../Bundler'

export const devServerConfig = (hooks: ServerHooks, args: Args) => {
  const srcPath = path.resolve(paths.root, args.src)
  const publicDirPath = path.resolve(paths.root, args.public)
  const publicDir = path.join(paths.root, publicDirPath)
  const nonExistentDir = path.resolve(__dirname, 'non-existent')

  return {
    publicPath: '/',
    compress: true,
    clientLogLevel: args.debug ? 'info' : 'none',
    contentBase: [nonExistentDir],
    watchContentBase: true,
    hot: true,
    quiet: !args.debug,
    open: true,
    watchOptions: {
      ignored: ignoredFiles(srcPath),
    },
    overlay: false,
    host: args.host,
    port: args.port,
    historyApiFallback: {
      disableDotRule: true,
    },
    before(app: any, server: any): void {
      app.use(evalSourceMapMiddleware(server))
      app.use(errorOverlayMiddleware())
      app.use('/public', express.static(publicDir))
      hooks.onPreCreateApp<any>(app)
    },
    after(app: any): void {
      hooks.onCreateApp<any>(app)
    },
  }
}
