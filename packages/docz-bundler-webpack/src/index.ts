import { Configuration as CFG } from 'webpack'
import { ConfigArgs, createBundler, BundlerCreate, BundlerServer } from 'docz'
import * as WebpackDevServer from 'webpack-dev-server'
import webpack from 'webpack'

import { devServerConfig } from './devserver'
import { createConfig as config } from './config'

export const server = (args: ConfigArgs) => (config: CFG): BundlerServer => {
  const compiler = webpack(config)
  const devserver = devServerConfig(args)
  const server = new WebpackDevServer(compiler, devserver)

  return {
    start: () => server.listen(args.port),
  }
}

export const bundler: BundlerCreate<CFG> = createBundler<CFG>({
  config,
  server,
  id: 'webpack',
})
