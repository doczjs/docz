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
    // Comment from react scripts
    // https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpackDevServer.config.js#L22
    // WebpackDevServer 2.4.3 introduced a security fix that prevents remote
    // websites from potentially accessing local content through DNS rebinding:
    // https://github.com/webpack/webpack-dev-server/issues/887
    // https://medium.com/webpack/webpack-dev-server-middleware-security-issues-1489d950874a
    // However, it made several existing use cases such as development in cloud
    // environment or subdomains in development significantly more complicated:
    // https://github.com/facebook/create-react-app/issues/2271
    // https://github.com/facebook/create-react-app/issues/2233
    // While we're investigating better solutions, for now we will take a
    // compromise. Since our WDS configuration only serves files in the `public`
    // folder we won't consider accessing them a vulnerability. However, if you
    // use the `proxy` feature, it gets more dangerous because it can expose
    // remote code execution vulnerabilities in backends like Django and Rails.
    // So we will disable the host check normally, but enable it if you have
    // specified the `proxy` setting. Finally, we let you override it if you
    // really know what you're doing with a special environment variable.
    disableHostCheck: !args.proxy || args.disableHostCheck === 'true',
    publicPath: '/',
    compress: true,
    logLevel: args.debug ? 'debug' : 'silent',
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
