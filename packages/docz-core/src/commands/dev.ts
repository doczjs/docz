import { load } from 'load-cfg'
import detectPort from 'detect-port'

import * as paths from '../config/paths'
import { Config } from './args'
import { DataServer } from '../DataServer'
import { webpack } from '../bundlers'

process.env.BABEL_ENV = process.env.BABEL_ENV || 'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

export const dev = async (args: Config) => {
  const config = load('docz', {
    ...args,
    paths,
    plugins: [],
    mdPlugins: [],
    hastPlugins: [],
    themeConfig: {},
  })

  const bundler = webpack(config)
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
