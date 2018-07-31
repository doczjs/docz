import { load, finds } from 'load-cfg'
import chokidar from 'chokidar'
import WS from 'ws'

import { Send } from '../DataServer'
import { Config, ThemeConfig } from '../commands/args'

const PARSE_CONFIG = 'PARSE_CONFIG'

const isSocketOpened = (socket: WS) => socket.readyState === WS.OPEN

interface Payload {
  title: string
  description: string
  ordering: string
  themeConfig: ThemeConfig
}

const getInitialConfig = (config: Config): Payload => ({
  title: config.title,
  description: config.description,
  themeConfig: config.themeConfig,
  ordering: config.ordering,
})

const updateConfig = (initial: Payload, send: Send, socket: WS) => () => {
  const config = load('docz', initial, true)
  if (isSocketOpened(socket)) send(PARSE_CONFIG, config)
}

export const parseConfig = (config: Config) => {
  const watcher = chokidar.watch(finds('docz'))

  return {
    onClose: () => watcher.close(),
    onStart: async (send: Send, socket: WS) => {
      const initialConfig = getInitialConfig(config)
      const update = updateConfig(initialConfig, send, socket)

      watcher.on('add', () => update())
      watcher.on('change', () => update())
      watcher.on('unlink', () => update())

      update()
    },
  }
}
