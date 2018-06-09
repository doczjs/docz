import { Configuration as CFG } from 'webpack'

import { Bundler } from '../../Bundler'
import { babelrc } from '../../utils/babelrc'
import { Config as Args } from '../../commands/args'
import { createConfig } from './config'
import { server } from './server'
import { build } from './build'

export type Env = 'production' | 'development'

export const bundler = (args: Args, env: Env): Bundler<CFG> => {
  const create = createConfig(babelrc(args))
  const config: any = create(args, env).toConfig()

  return new Bundler({
    args,
    config,
    build: build(args),
    server: server(args),
  })
}
