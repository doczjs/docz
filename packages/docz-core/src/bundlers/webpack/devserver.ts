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
  const { port, host } = args
  const nonExistentDir = path.resolve(__dirname, 'non-existent')
  const logLevel = (level: string) => (args.debug ? 'debug' : level)

  return {
    compiler,
    host,
    port,
    content: [nonExistentDir],
    dev: {
      logLevel: logLevel('silent'),
    },
    hot: {
      logLevel: logLevel('error'),
      reload: false,
    },
    logLevel: logLevel('error'),
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
