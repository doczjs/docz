import { Arguments } from 'yargs'
import * as WebpackDevServer from 'webpack-dev-server'

import { entriesMapper } from './compiler'
import { createCompiler } from './compiler'
import { devServerConfig } from './config/dev-server'

export const server = async ({ files: pattern }: Arguments) => {
  const entries = await entriesMapper(pattern)
  const compiler = await createCompiler(entries)
  const server = new WebpackDevServer(compiler, devServerConfig())

  server.listen(3000)
}
