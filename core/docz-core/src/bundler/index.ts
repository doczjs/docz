import { Bundler } from '../lib/Bundler'
import { Config as Args } from '../config/argv'

import { server } from './server'
import { build } from './build'

export const bundler = (args: Args) => {
  return new Bundler({ args, build, server: server(args) })
}
