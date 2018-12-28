process.setMaxListeners(Infinity)

import { Arguments } from 'yargs'
import logger from 'signale'
import envDotProp from 'env-dot-prop'

import { Entries } from '../Entries'
import { DataServer } from '../DataServer'
import { parseConfig } from '../config/docz'
import { promiseLogger } from '../utils/promise-logger'
import { onSignal } from '../utils/on-signal'
import { bundler as webpack } from '../webpack'
import * as states from '../states'

export const dev = async (args: Arguments) => {
  const env = envDotProp.get('node.env')
  const config = await parseConfig(args)
  const bundler = webpack(config, env)
  const entries = new Entries(config)

  const bundlerConfig = await bundler.mountConfig(env)
  const app = await promiseLogger(
    bundler.createApp(bundlerConfig),
    'Creating app...'
  )

  try {
    await promiseLogger(Entries.writeApp(config, true), 'Parsing mdx files')
  } catch (err) {
    logger.fatal('Failed to build your files:', err)
    process.exit(1)
  }

  const server = await promiseLogger(app.start(), 'Starting your server')
  const dataServer = new DataServer(
    server.listeningApp,
    config.websocketPort,
    config.websocketHost
  )

  if (args.propsParser) dataServer.register([states.props(config)])
  dataServer.register([states.config(config), states.entries(entries, config)])

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
