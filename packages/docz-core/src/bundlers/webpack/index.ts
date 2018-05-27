import webpack, { Configuration as CFG } from 'webpack'
import serve from 'webpack-serve'
import detectPort from 'detect-port'

import { devServerConfig } from './devserver'
import { createConfig } from './config'
import { Bundler, BundlerServer } from '../../Bundler'
import { Config as Args } from '../../commands/args'

export type Env = 'production' | 'development'

export const server = (args: Args) => async (
  config: CFG
): Promise<BundlerServer> => {
  const compiler = webpack(config)
  const port = await detectPort(args.port)
  const devserver = devServerConfig({ ...args, port }, compiler, config)

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

export const bundler = (args: Args, env: Env): Bundler<CFG> => {
  const config: any = createConfig(args, env).toConfig()

  return new Bundler({
    args,
    config,
    server: server(args),
  })
}
