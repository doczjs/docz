import { Configuration } from 'webpack'
import { ConfigArgs, createBundler, BundlerCreate } from 'docz'
import * as WebpackDevServer from 'webpack-dev-server'
import webpack from 'webpack'

import { devServerConfig } from './devserver'
import { createConfig as config } from './config'

export const compiler = (args: ConfigArgs) => (cfg: Configuration) =>
  webpack(cfg)

export const server = (cfg: ConfigArgs) => (comp: any): WebpackDevServer =>
  new WebpackDevServer(comp, devServerConfig(cfg))

export const bundler: BundlerCreate<
  Configuration,
  WebpackDevServer
> = createBundler<Configuration, WebpackDevServer>({
  compiler,
  config,
  server,
  id: 'webpack',
})
