import * as fs from 'fs'
import { Configuration as Config } from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import * as paths from '../config/paths'
import { devServerConfig } from './devserver'
import { Config as Args } from '../commands/args'
import { ServerHooks as Hooks } from '../Bundler'
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
      devServer.listen(args.port, args.host, err => {
        if (err) return console.log(err)
        hooks.onServerListening<WebpackDevServer>(devServer)
      })

      return devServer
    },
  }
}
