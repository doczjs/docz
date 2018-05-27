import { Configuration as CFG } from 'webpack'

import { Bundler } from '../../Bundler'
import { Config as Args } from '../../commands/args'
import { createConfig } from './config'
import { server } from './server'
import { build } from './build'

export type Env = 'production' | 'development'

export const bundler = (args: Args, env: Env): Bundler<CFG> => {
  const config: any = createConfig(args, env).toConfig()

  return new Bundler({
    args,
    config,
    build,
    server: server(args),
  })
}
