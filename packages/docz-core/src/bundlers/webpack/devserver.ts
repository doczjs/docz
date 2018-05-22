import * as path from 'path'
import { Compiler, Configuration } from 'webpack'
import convert from 'koa-connect'
import history from 'connect-history-api-fallback'

import { Config } from '../../commands/args'

export const devServerConfig = (
  args: Config,
  compiler: Compiler,
  config: Configuration
) => {
  const nonExistentDir = path.resolve(__dirname, 'non-existent')
  const logLevel = (level: string) => (args.debug ? 'debug' : level)

  return {
    compiler,
    host: args.host,
    port: args.port,
    content: [nonExistentDir],
    logLevel: logLevel('error'),
    dev: {
      logLevel: logLevel('silent'),
    },
    hot: {
      reload: false,
      logLevel: logLevel('error'),
    },
    add: (app: any) => {
      app.use(
        convert(
          history({
            rewrites: [{ from: /\.html$/, to: '/' }],
          })
        )
      )
    },
  }
}
