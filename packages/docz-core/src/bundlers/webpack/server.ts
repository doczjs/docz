import { Configuration as Config } from 'webpack'
import serve from 'webpack-serve'

import { devServerConfig } from './devserver'
import { BundlerServer, ServerHooks } from '../../Bundler'
import { Config as Args } from '../../commands/args'
import * as http from 'http'

type Server = Promise<BundlerServer>

export const server = (args: Args) => async (
  config: Config,
  hooks: ServerHooks
): Server => {
  const devserver = devServerConfig(args, config, hooks)

  return {
    start: async () => {
      const instance = await serve({}, devserver)
      hooks.OnServerListening<http.Server>(instance.app.server)

      return {
        ...instance,
        close: () => instance.app.stop(),
      }
    },
  }
}
