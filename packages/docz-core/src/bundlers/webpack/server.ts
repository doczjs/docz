import webpack, { Configuration as CFG } from 'webpack'
import serve from 'webpack-serve'
import detectPort from 'detect-port'

import { devServerConfig } from './devserver'
import { BundlerServer } from '../../Bundler'
import { Config as Args } from '../../commands/args'

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
