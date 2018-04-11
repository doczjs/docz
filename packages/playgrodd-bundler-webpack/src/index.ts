import { Bundler, IBundlerFactoryParams } from 'playgrodd-core'
import { Configuration } from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'

import { config, setup, server } from './config.dev'

export const create = (params: IBundlerFactoryParams) =>
  new Bundler<Configuration, WebpackDevServer>({
    id: 'webpack',
    config: config(params),
    server: server(params),
    setup: setup(params),
  })
