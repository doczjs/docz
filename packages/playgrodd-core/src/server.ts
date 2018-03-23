import { Arguments } from 'yargs'
import * as express from 'express'
import * as hotMiddleware from 'webpack-hot-middleware'
import * as devServerMiddleware from 'webpack-dev-middleware'
import * as historyApiFallback from 'connect-history-api-fallback'

import { entriesMapper } from './compiler'
import { createCompiler } from './compiler'

export const server = async ({ files: pattern }: Arguments) => {
  const app = express()
  const entries = await entriesMapper(pattern)
  const compiler = await createCompiler(entries)

  const opts = {
    publicPath: '/',
    logLevel: 'warn',
    watchOptions: {
      ignored: /node_modules/,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  }

  app.use(historyApiFallback())
  app.use(devServerMiddleware(compiler, opts))
  app.use(hotMiddleware(compiler, { log: false, heartbeat: 2000 }))

  app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
  })
}
