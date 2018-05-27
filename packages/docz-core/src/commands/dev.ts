import detectPort from 'detect-port'

import { Config } from './args'
import { DataServer } from '../DataServer'
import { webpack } from '../bundlers'
import { loadConfig } from '../utils/load-config'

process.env.BABEL_ENV = process.env.BABEL_ENV || 'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

export const dev = async (args: Config) => {
  const config = loadConfig(args)
  const bundler = webpack(config, 'development')
  const server = await bundler.createServer(bundler.getConfig())
  const app = await server.start()

  app.on('listening', async ({ server }) => {
    const host = config.websocketHost
    const port = await detectPort(config.websocketPort)
    const dataServer = new DataServer({ server, config, port, host })

    await dataServer.processEntries()
    await dataServer.processThemeConfig()
  })
}
