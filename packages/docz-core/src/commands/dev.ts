import * as fs from 'fs-extra'
import logger from 'signale'
import detectPort from 'detect-port'

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
  const port = await detectPort(config.port)
  const bundler = webpack({ ...config, port }, 'development')
  const entries = new Entries(config)
  const map = await entries.get()
  const server = await bundler.createServer(bundler.getConfig())
  const app = await server.start()

  app.on('listening', async ({ server, options }) => {
    const websocketPort = await detectPort(config.websocketPort)
    const run = Plugin.runPluginsMethod(config.plugins)
    const newConfig = { ...config, websocketPort }
    const dataServer = new DataServer({ server, config: newConfig })

    try {
      logger.info('Removing old app files')
      await fs.remove(paths.app)

      logger.info('Creating new docz files')
      await Entries.writeApp(newConfig, true)
      await Entries.writeImports(map)

      logger.info(`Setup entries socket on port ${websocketPort}`)
      await dataServer.processEntries(entries)
      await dataServer.processThemeConfig()
      await run('onServerListening', server)
    } catch (err) {
      logger.fatal('Failed to process your server:', err)
      process.exit(1)
    }
  })
}
