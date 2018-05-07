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

  return {
    compiler,
    host,
    port,
    content: [nonExistentDir],
    dev: {
      logLevel: args.debug ? 'debug' : 'warn',
    },
    hot: {
      logLevel: 'error',
      reload: false,
    },
    logLevel: 'error',
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
