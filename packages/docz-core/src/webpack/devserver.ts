import * as path from 'path'
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware'
import evalSourceMapMiddleware from 'react-dev-utils/evalSourceMapMiddleware'
import ignoredFiles from 'react-dev-utils/ignoredFiles'

import * as paths from '../config/paths'
import { Config as Args } from '../commands/args'
import { ServerHooks } from '../Bundler'

export const devServerConfig = (hooks: ServerHooks, args: Args) => {
  const srcPath = path.resolve(paths.root, args.src)
  const publicDir = path.join(paths.root, args.public)

  return {
    publicPath: '/',
    compress: true,
    clientLogLevel: 'none',
    contentBase: publicDir,
    watchContentBase: true,
    hot: true,
    quiet: true,
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
      hooks.onPreCreateApp<any>(app)
    },
    after(app: any, server: any): void {
      hooks.onCreateApp<any>(app)
    },
  }
}
