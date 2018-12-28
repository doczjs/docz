import * as fs from 'fs'
import logger from 'signale'
import { Configuration as Config } from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import * as paths from '../config/paths'
import { devServerConfig } from './devserver'
import { Config as Args } from '../config/argv'
import { ServerHooks as Hooks } from '../lib/Bundler'
import * as serverUtils from 'react-dev-utils/WebpackDevServerUtils'

export const server = (args: Args) => async (config: Config, hooks: Hooks) => {
  const useYarn = fs.existsSync(paths.appYarnLock)
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
  const appName = require(paths.appPackageJson).name
  const urls = serverUtils.prepareUrls(protocol, args.host, args.port)
  const serverConfig: any = devServerConfig(hooks, args)

  const compiler = serverUtils.createCompiler(
    require('webpack'),
    config,
    appName,
    urls,
    useYarn
  )

  return {
    start: async () => {
      const devServer = new WebpackDevServer(compiler, serverConfig)

      return devServer.listen(args.port, args.host, err => {
        if (err) return logger.fatal(err)
        hooks.onServerListening<WebpackDevServer>(devServer)
      })
    },
  }
}
