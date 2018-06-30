import * as fs from 'fs-extra'
import logger from 'signale'
import detectPort from 'detect-port'
import friendlyErrors from 'friendly-errors-webpack-plugin'

import * as paths from '../config/paths'
import { Config } from './args'
import { DataServer } from '../DataServer'
import { webpack } from '../bundlers'
import { Entries } from '../Entries'
import { Plugin } from '../Plugin'
import { loadConfig } from '../utils/load-config'

process.env.BABEL_ENV = process.env.BABEL_ENV || 'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

export const dev = async (args: Config) => {
  const config = loadConfig(args)
  const bundler = webpack(config, 'development')
  const entries = new Entries(config)
  const map = await entries.get()
  const server = await bundler.createServer(bundler.getConfig())
  const app = await server.start()

  app.on('listening', async ({ server, options }) => {
    const bundlerConfig = bundler.getConfig()
    if (
      bundlerConfig.plugins &&
      bundlerConfig.mode === 'development' &&
      !args.debug
    ) {
      const friendlyErrorsPlugin: typeof friendlyErrors = bundlerConfig.plugins
        .filter((p: object): boolean => p instanceof friendlyErrors)
        .find(e => !!e)
      if (friendlyErrorsPlugin) {
        const protocol = options.https ? 'https' : 'http'
        friendlyErrorsPlugin.compilationSuccessInfo.messages.push(
          `Your application is running at ${protocol}://${options.host}:${
            options.port
          }`
        )
      }
    }

    const port = await detectPort(config.websocketPort)
    const run = Plugin.runPluginsMethod(config.plugins)
    const newConfig = { ...config, websocketPort: port }
    const dataServer = new DataServer({ server, config: newConfig })

    try {
      logger.info('Removing old app files')
      await fs.remove(paths.app)

      logger.info('Creating new docz files')
      await Entries.writeApp(newConfig, true)
      await Entries.writeImports(map)

      logger.info(`Setup entries socket on port ${port}`)
      await dataServer.processEntries(entries)
      await dataServer.processThemeConfig()
      await run('onServerListening', server)
    } catch (err) {
      logger.fatal('Failed to process your server:', err)
      process.exit(1)
    }
  })
}
