import { load, finds } from 'load-cfg'
import chokidar from 'chokidar'
import WS from 'ws'

import * as paths from '../config/paths'
import { Config } from './args'

import { Entries, EntryMap } from '../Entries'
import { webpack } from '../bundlers'

process.env.BABEL_ENV = process.env.BABEL_ENV || 'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const isSocketOpened = (socket: WS) => socket.readyState === WS.OPEN

const entriesData = (entries: EntryMap, config: Config) =>
  JSON.stringify({ type: 'docz.entries', data: entries })

const updateEntries = (socket: WS) => (config: Config) => async () => {
  if (isSocketOpened(socket)) {
    const newEntries = new Entries(config)
    const newMap = await newEntries.getMap()

    await Entries.rewrite(newMap)
    socket.send(entriesData(newMap, config))
  }
}

const processEntries = (config: Config) => async (ws: WS.Server) => {
  const entries = new Entries(config)
  const map = await entries.getMap()
  const watcher = chokidar.watch(config.files, {
    ignored: /(^|[\/\\])\../,
  })

  const handleConnection = async (socket: WS) => {
    const update = updateEntries(socket)

    socket.send(entriesData(map, config))
    watcher.on('change', update(config))
    watcher.on('unlink', update(config))
    watcher.on('raw', (event: string, path: string, details: any) => {
      if (details.event === 'moved' && details.type === 'directory') {
        update(config)()
      }
    })
  }

  ws.on('connection', handleConnection)
  ws.on('close', () => watcher.close())

  await Entries.write(config, map)
}

const configData = (config: Config) =>
  JSON.stringify({ type: 'docz.config', data: config.themeConfig })

const updateConfig = (socket: WS, args: Config) => () => {
  const config = load('docz', {}, true)

  if (isSocketOpened(socket)) {
    socket.send(configData(config))
  }
}

const processThemeConfig = (config: Config) => async (ws: WS.Server) => {
  const watcher = chokidar.watch(finds('docz'))

  const handleConnection = async (socket: WS) => {
    const update = updateConfig(socket, config)

    watcher.on('add', update)
    watcher.on('change', update)
    watcher.on('unlink', update)

    update()
  }

  ws.on('connection', handleConnection)
  ws.on('close', () => watcher.close())
}

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

  app.on('listening', async server => {
    const ws = new WS.Server({
      server,
      host: config.websocketHost,
      port: config.websocketPort,
    })

    const handleClose = () => {
      ws.close()
    }

    server.on('close', handleClose)
    process.on('exit', handleClose)
    process.on('SIGINT', handleClose)

    await processEntries(config)(ws)
    await processThemeConfig(config)(ws)
  })
}
