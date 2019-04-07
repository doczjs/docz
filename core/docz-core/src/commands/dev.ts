process.setMaxListeners(Infinity)

import { Arguments } from 'yargs'
import * as logger from 'signale'
import * as envDotProp from 'env-dot-prop'

import { Entries } from '../lib/Entries'
import { DataServer } from '../lib/DataServer'
import { Socket } from '../lib/Socket'
import { parseConfig } from '../config/docz'
import { onSignal } from '../utils/on-signal'
import { bundler as webpack } from '../bundler'
import { openBrowser } from '../utils/open-browser'
import * as states from '../states'

export const dev = async (args: Arguments<any>) => {
  const env = envDotProp.get('node.env')
  const config = await parseConfig(args)
  const bundler = webpack(config, env)
  const entries = new Entries(config)
  const { websocketHost, websocketPort } = config

  const bundlerConfig = await bundler.mountConfig(env)
  const app = await bundler.createApp(bundlerConfig)

  try {
    await Entries.writeApp(config, true)
    await Entries.writeImports(await entries.get())
  } catch (err) {
    logger.fatal('Failed to build your files')
    logger.error(err)
    process.exit(1)
  }

  const server = await app.start()
  const dataServer = new DataServer()
  const socket = new Socket(server, websocketHost, websocketPort)

  if (config.propsParser) dataServer.register([states.props(config)])
  dataServer.register([states.config(config), states.entries(entries, config)])

  try {
    await dataServer.start()
    openBrowser(`http://${config.host}:${config.port}`)
  } catch (err) {
    logger.fatal('Failed to process data server')
    logger.error(err)
    dataServer.close()
    process.exit(1)
  }

  socket.onConnection((_, emit) => {
    const subscribe = dataServer.onStateChange(action => {
      emit(action.type, action.payload)
    })

    return () => subscribe()
  })

  onSignal(async () => {
    dataServer.close()
    server.close()
  })

  server.on('close', async () => {
    dataServer.close()
  })
}
