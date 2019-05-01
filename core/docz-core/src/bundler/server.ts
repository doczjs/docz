import * as fs from 'fs'
import logger from 'signale'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { Configuration as Config } from 'webpack'
import { createCompiler } from 'react-dev-utils/WebpackDevServerUtils'
import { prepareUrls } from 'react-dev-utils/WebpackDevServerUtils'

import { devServerConfig } from './devserver'
import { Config as Args } from '../config/argv'
import { ServerHooks as Hooks } from '../lib/Bundler'

import * as paths from '../config/paths'
const useYarn = fs.existsSync(paths.appYarnLock)

export const server = (args: Args) => async (config: Config, hooks: Hooks) => ({
  start: async () => {
    const serverConfig: any = devServerConfig(hooks, args)
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
    const appName = require(paths.packageJson).name
    const useTypescript = args.typescript
    const urls = prepareUrls(protocol, args.host, args.port)

    const devSocket = {
      warnings: (warnings: any) =>
        devServer.sockWrite(devServer.sockets, 'warnings', warnings),
      errors: (errors: any) =>
        devServer.sockWrite(devServer.sockets, 'errors', errors),
    }

    const compiler = createCompiler({
      appName,
      config,
      devSocket,
      urls,
      useYarn,
      useTypescript,
      webpack,
    })

    const devServer = new WebpackDevServer(compiler, serverConfig) as any

    return devServer.listen(args.port, args.host, (err: any) => {
      if (err) return logger.fatal(err)
      hooks.onServerListening<WebpackDevServer>(devServer)
    })
  },
})
