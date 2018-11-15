import * as path from 'path'
import * as fs from 'fs-extra'
import * as Koa from 'koa'
import { Configuration } from 'webpack'
import mount from 'koa-mount'
import range from 'koa-range'
import convert from 'koa-connect'
import serveStatic from 'koa-static'
import history from 'connect-history-api-fallback'
import serveWaitpage from 'webpack-serve-waitpage'

import * as paths from '../config/paths'
import { Config } from '../commands/args'
import { ServerHooks } from '../Bundler'

export const devServerConfig = (
  args: Config,
  config: Configuration,
  hooks: ServerHooks
) => {
  const nonExistentDir = path.resolve(__dirname, 'non-existent')
  const logLevel = (level: string) => (args.debug ? 'debug' : level)
  const publicDir = path.join(paths.root, args.public)

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
      host: args.hotHost,
      port: args.hotPort,
    },
    add: (app: Koa, middleware: any, options: any) => {
      middleware.webpack()
      middleware.content()

      app.use(range)

      if (fs.existsSync(publicDir)) {
        app.use(mount(path.join(args.base, '/public'), serveStatic(publicDir)))
      }

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
