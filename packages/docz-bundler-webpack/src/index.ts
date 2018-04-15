import { Configuration } from 'webpack'
import { createBundler, IBundlerCreate } from 'docz-core'
import * as WebpackDevServer from 'webpack-dev-server'

import { config, compiler, server } from './config.dev'

export const bundler: IBundlerCreate<
  Configuration,
  WebpackDevServer
> = createBundler<Configuration, WebpackDevServer>({
  id: 'webpack',
  config,
  server,
  compiler,
})
