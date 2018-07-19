import * as path from 'path'
import * as Koa from 'koa'
import { Configuration } from 'webpack'
import convert from 'koa-connect'
import history from 'connect-history-api-fallback'
import serveWaitpage from 'webpack-serve-waitpage'

import { Config } from '../../commands/args'
import { ServerHooks } from '../../Bundler'

export const devServerConfig = (
  args: Config,
  config: Configuration,
  hooks: ServerHooks
) => {
  const nonExistentDir = path.resolve(__dirname, 'non-existent')
  const logLevel = (level: string) => (args.debug ? 'debug' : level)

  return {
    config,
    host: args.host,
    port: args.port,
    content: [nonExistentDir],
    logLevel: logLevel('error'),
    devMiddleware: {
      logLevel: logLevel('silent'),
    },
    hotClient: {
      reload: false,
      logLevel: logLevel('error'),
    },
    add: (app: Koa, middleware: any, options: any) => {
      middleware.webpack()
      middleware.content()

      app.use(
        convert(
          history({
            rewrites: [{ from: /\.html$/, to: '/' }],
          })
        )
      )

      app.use(serveWaitpage(options, { title: args.title }))
      hooks.onCreateApp<Koa>(app)
    },
  }
}
