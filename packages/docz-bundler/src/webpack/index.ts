import { Configuration as CFG } from 'webpack'
import WebpackDevServer from 'webpack-dev-server-speedy'
import webpack from 'webpack'

import { devServerConfig } from './devserver'
import { createConfig as config } from './config'
import { Bundler, BundlerServer } from '../Bundler'
import { ConfigArgs as Args } from '../Server'

export const server = (args: Args) => (config: CFG): BundlerServer => {
  const compiler = webpack(config)
  const devserver = devServerConfig(args)
  const server = new WebpackDevServer(compiler, devserver)

  return {
    start: () => server.listen(args.port),
  }
}

export const bundler = (args: Args): Bundler<CFG> =>
  new Bundler({
    args,
    config: config(args),
    server: server(args),
  })
