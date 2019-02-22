import chalk from 'chalk'
import logger from 'signale'
import WebpackDevServer from 'webpack-dev-server'
import { Configuration as Config } from 'webpack'

import { devServerConfig } from './devserver'
import { Config as Args } from '../config/argv'
import { ServerHooks as Hooks } from '../lib/Bundler'

const createCompiler = (config: Config) =>
  new Promise<any>(resolve => {
    try {
      resolve(require('webpack')(config))
    } catch (err) {
      logger.fatal(chalk.red('Failed to compile.'))
      logger.error(err)
      process.exit(1)
    }
  })

export const server = (args: Args) => async (config: Config, hooks: Hooks) => ({
  start: async () => {
    const serverConfig: any = devServerConfig(hooks, args)
    const compiler = await createCompiler(config)
    const devServer = new WebpackDevServer(compiler, serverConfig)

    return devServer.listen(args.port, args.host, err => {
      if (err) return logger.fatal(err)
      hooks.onServerListening<WebpackDevServer>(devServer)
    })
  },
})
