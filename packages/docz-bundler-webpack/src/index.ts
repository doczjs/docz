import { Configuration as CFG } from 'webpack'
import { ConfigArgs, createBundler, BundlerCreate } from 'docz'
import * as Server from 'webpack-dev-server'
import webpack from 'webpack'

import { devServerConfig } from './devserver'
import { createConfig as config } from './config'

export const server = (args: ConfigArgs) => (config: CFG): Server => {
  const compiler = webpack(config)
  const devserver = devServerConfig(args)

  return new Server(compiler, devserver)
}

export const bundler: BundlerCreate<CFG, Server> = createBundler<CFG, Server>({
  config,
  server,
  id: 'webpack',
})
