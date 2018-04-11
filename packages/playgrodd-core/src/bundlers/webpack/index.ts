import { Configuration } from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'

import { Bundler } from '../../Bundler'
import { config, setup, server } from './config-dev'

interface IBundlerParams {
  port: number
}

export const bundler = ({ port }: IBundlerParams): Bundler =>
  new Bundler<Configuration, WebpackDevServer>({
    id: 'webpack',
    config,
    server,
    setup: setup(port),
  })
