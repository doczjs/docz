process.setMaxListeners(Infinity)

import logger from 'signale'
import detectPort from 'detect-port'
import envDotProp from 'env-dot-prop'

import * as states from '../states'
import { Config } from './args'
import { DataServer } from '../DataServer'
import { bundler as webpack } from '../webpack'
import { Entries } from '../Entries'
import { loadConfig } from '../utils/load-config'
import { promiseLogger } from '../utils/promise-logger'
import { onSignal } from '../utils/on-signal'

export const dev = async (args: Config) => {
  const env = envDotProp.get('node.env')
  const config = await loadConfig(args)
  const port = await detectPort(config.port)
  const websocketPort = await detectPort(config.websocketPort)
  const newConfig = { ...config, websocketPort, port }
  const bundler = webpack(newConfig, env)
  const entries = new Entries(config)

  const bundlerConfig = await bundler.mountConfig(env)
  const app = await promiseLogger(
    bundler.createApp(bundlerConfig),
    'Creating app...'
  )

  try {
    await promiseLogger(Entries.writeApp(newConfig, true), 'Parsing mdx files')
  } catch (err) {
    logger.fatal('Failed to build your files:', err)
    process.exit(1)
  }

  const server = await promiseLogger(app.start(), 'Starting your server')
  const dataServer = new DataServer(
    server.listeningApp,
    websocketPort,
    config.websocketHost
  )

  if (args.propsParser) dataServer.register([states.props(newConfig)])
  dataServer.register([
    states.config(newConfig),
    states.entries(entries, newConfig),
  ])

  try {
    await promiseLogger(dataServer.init(), 'Running data server')
    await dataServer.listen()
  } catch (err) {
    logger.fatal('Failed to process your server:', err)
    await dataServer.close()
    process.exit(1)
  }

  onSignal(async () => {
    await dataServer.close()
    server.close()
  })

  server.listeningApp.on('close', async () => {
    await dataServer.close()
  })
}
