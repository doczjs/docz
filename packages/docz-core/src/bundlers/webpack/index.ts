import { Configuration as CFG } from 'webpack'

import { Bundler } from '../../Bundler'
import { Env } from '../../commands/args'

import { createConfig, Args } from './config'
import { server } from './server'
import { build } from './build'

export const bundler = (args: Args, env: Env): Bundler<CFG> =>
  new Bundler({
    args,
    build,
    config: createConfig(args, env),
    server: server(args),
  })
