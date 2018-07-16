import { Configuration as CFG } from 'webpack'

import { Bundler } from '../../Bundler'
import { Config as Args, Env } from '../../commands/args'

import { createConfig } from './config'
import { server } from './server'
import { build } from './build'

export const bundler = (args: Args, env: Env): Bundler<CFG> =>
  new Bundler({
    args,
    config: createConfig(args, env),
    build: build(args),
    server: server(args),
  })
