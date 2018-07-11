import { Configuration as Config } from 'webpack'
import serve from 'webpack-serve'
import detectPort from 'detect-port'

import { devServerConfig } from './devserver'
import { BundlerServer } from '../../Bundler'
import { Config as Args } from '../../commands/args'

type Server = Promise<BundlerServer>

export const server = (args: Args) => async (config: Config): Server => {
  const port = await detectPort(args.port)
  const devserver = devServerConfig({ ...args, port }, config)

  return {
    start: async () => {
      const instance = await serve({}, devserver)

      return {
        ...instance,
        close: () => instance.app.stop(),
      }
    },
  }
}
