import { Configuration } from 'webpack'
import { ConfigArgs, createBundler, BundlerCreate } from 'docz-core'
import * as webpack from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'
import WebpackDevServerUtils from 'react-dev-utils/WebpackDevServerUtils'

import { devServerConfig } from './devserver'
import { createConfig as config } from './config'

export const compiler = ({ paths, port, host, protocol }: ConfigArgs) => (
  cfg: Configuration
) => {
  const appName = require(paths.packageJson).name
  const urls = WebpackDevServerUtils.prepareUrls(protocol, host, port)

  return WebpackDevServerUtils.createCompiler(webpack, cfg, appName, urls, true)
}

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
