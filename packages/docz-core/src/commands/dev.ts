import logger from 'signale'
import detectPort from 'detect-port'
import envDotProp from 'env-dot-prop'

import * as states from '../states'
import { Config } from './args'
import { DataServer } from '../DataServer'
import { webpack } from '../bundlers'
import { Entries } from '../Entries'
import { loadConfig } from '../utils/load-config'

export const dev = async (args: Config) => {
  const env = envDotProp.get('node.env')
  const config = loadConfig(args)
  const port = await detectPort(config.port)
  const hotPort = await detectPort(config.hotPort)
  const websocketPort = await detectPort(config.websocketPort)

  envDotProp.set(
    'webpack.server.overlay.ws.url',
    `ws://${config.hotHost}:${hotPort}`
  )

  const newConfig = { ...config, websocketPort, hotPort, port }
  const bundler = webpack(newConfig, env)
  const entries = new Entries(config)

  const bundlerConfig = await bundler.getConfig(env)
  const server = await bundler.createServer(bundlerConfig)
  const { app } = await server.start()
  const dataServer = new DataServer(
    app.server,
    websocketPort,
    config.websocketHost
  )

  dataServer.register([
    states.config(newConfig),
    states.entries(entries, newConfig),
    states.props(entries, newConfig),
  ])

  try {
    await Entries.writeApp(newConfig, true)
    await dataServer.init()
    await dataServer.listen()
  } catch (err) {
    logger.fatal('Failed to process your server:', err)
    process.exit(1)
  }
}
