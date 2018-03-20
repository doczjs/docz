import express from 'express'
import { Arguments } from 'yargs'
import devServerMiddleware from 'webpack-dev-middleware'
import historyApiFallback from 'connect-history-api-fallback'
import hotMiddleware from 'webpack-hot-middleware'

import { componentsFromPattern } from './utils/components'
import { createCompiler, devServerConfig } from './compiler'

exports.server = async ({ files: pattern }: Arguments) => {
  const app = express()
  const components = await componentsFromPattern(pattern)
  const compiler = await createCompiler(components)

  app.use(historyApiFallback())
  app.use(hotMiddleware(compiler, { log: false, heartbeat: 2000 }))
  app.use(devServerMiddleware(compiler, devServerConfig(compiler)))

  app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
  })
}
