import { Configuration as CFG } from 'webpack'
import WebpackDevServer from 'webpack-dev-server-speedy'
import webpack from 'webpack'

import { devServerConfig } from './devserver'
import { createConfig as config } from './config'
import { Bundler, BundlerServer } from '../../Bundler'
import { Config } from '../../commands/args'

export const server = (args: Config) => (config: CFG): BundlerServer => {
  const compiler = webpack(config)
  const devserver = devServerConfig(args)
  const server = new WebpackDevServer(compiler, devserver)

  return {
    start: () => server.listen(args.port),
  }
}

export const bundler = (args: Config): Bundler<CFG> =>
  new Bundler({
    args,
    config: config(args),
    server: server(args),
  })
