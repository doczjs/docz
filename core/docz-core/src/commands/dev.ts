process.setMaxListeners(Infinity)

import { Arguments } from 'yargs'
import * as logger from 'signale'
import * as envDotProp from 'env-dot-prop'
import PrettyError from 'pretty-error'

import { Entries } from '../lib/Entries'
import { DataServer } from '../lib/DataServer'
import { parseConfig } from '../config/docz'
import { onSignal } from '../utils/on-signal'
import { bundler as webpack } from '../bundler'
import * as states from '../states'

const pe = new PrettyError()
export const dev = async (args: Arguments<any>) => {
  const env = envDotProp.get('node.env')
  const config = await parseConfig(args)
  const bundler = webpack(config, env)
  const entries = new Entries(config)

  const bundlerConfig = await bundler.mountConfig(env)
  const app = await bundler.createApp(bundlerConfig)

  try {
    await Entries.writeApp(config, true)
  } catch (err) {
    logger.fatal('Failed to build your files')
    pe.render(err)
    process.exit(1)
  }

  const server = await app.start()
  const dataServer = new DataServer(
    server,
    config.websocketPort,
    config.websocketHost
  )

  if (args.propsParser) dataServer.register([states.props(config)])
  dataServer.register([states.config(config), states.entries(entries, config)])

  try {
    await dataServer.init()
    await dataServer.listen()
  } catch (err) {
    logger.fatal('Failed to process data server')
    pe.render(err)
    await dataServer.close()
    process.exit(1)
  }

  onSignal(async () => {
    await dataServer.close()
    server.close()
  })

  server.on('close', async () => {
    await dataServer.close()
  })
}
