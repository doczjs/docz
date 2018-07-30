import * as fs from 'fs-extra'
import logger from 'signale'
import detectPort from 'detect-port'
import envDotProp from 'env-dot-prop'

import * as paths from '../config/paths'
import { Config } from './args'
import { DataServer } from '../DataServer'
import { webpack } from '../bundlers'
import { Entries } from '../Entries'
import { loadConfig } from '../utils/load-config'

export const dev = async (args: Config) => {
  const env = envDotProp.get('node.env')
  const config = loadConfig(args)
  const port = await detectPort(config.port)
  const websocketPort = await detectPort(config.websocketPort)
  const hotPort = await detectPort(config.hotPort)
  const entries = new Entries(config)

  envDotProp.set(
    'webpack.server.overlay.ws.url',
    `ws://${config.hotHost}:${hotPort}`
  )

  const newConfig = { ...config, websocketPort, hotPort, port }
  const bundler = webpack(newConfig, env)
  const bundlerConfig = await bundler.getConfig(env)
  const server = await bundler.createServer(bundlerConfig)
  const { app } = await server.start()
  const dataServer = new DataServer({
    server: app.server,
    config: newConfig,
  })

  try {
    logger.info('Removing old app files')
    await fs.remove(paths.app)

    logger.info('Creating boilerplate files')
    await Entries.writeApp(newConfig, true)
    await Entries.writeImports(await entries.get())

    logger.info(`Setup entries websockets server on port ${websocketPort}`)
    await dataServer.processEntries(entries)
    await dataServer.processThemeConfig()
  } catch (err) {
    logger.fatal('Failed to process your server:', err)
    process.exit(1)
  }
}
