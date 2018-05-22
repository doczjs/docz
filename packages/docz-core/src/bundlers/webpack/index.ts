import webpack from 'webpack'
import { Configuration as CFG } from 'webpack'
import serve from 'webpack-serve'

import { devServerConfig } from './devserver'
import { createConfig as config } from './config'
import { Bundler, BundlerServer } from '../../Bundler'
import { Config } from '../../commands/args'

export const server = (args: Config) => (config: CFG): BundlerServer => {
  const compiler = webpack(config)
  const devserver = devServerConfig(args, compiler, config)

  return {
    start: async () => {
      const instance = await serve(devserver)

      return {
        on: instance.on,
        close: instance.close,
      }
    },
  }
}

export const bundler = (args: Config): Bundler<CFG> =>
  new Bundler({
    args,
    config: config(args),
    server: server(args),
  })
