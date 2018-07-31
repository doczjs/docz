import chokidar from 'chokidar'
import WS from 'ws'

import { Send } from '../DataServer'
import { Entries } from '../Entries'
import { Config } from '../commands/args'

const LOADING = 'LOADING'
const PARSE_ENTRIES = 'PARSE_ENTRIES'

const isSocketOpened = (socket: WS) => socket.readyState === WS.OPEN

const updateEntries = (
  entries: Entries,
  send: Send,
  socket: WS
) => async () => {
  if (isSocketOpened(socket)) {
    const map = await entries.get()

    await Entries.writeImports(map)
    send(PARSE_ENTRIES, map)
  }
}

export const parseEntries = (entries: Entries, config: Config) => {
  const watcher = chokidar.watch(config.files, {
    ignored: /(^|[\/\\])\../,
  })

  return {
    onClose: () => watcher.close(),
    onStart: async (send: Send, socket: WS) => {
      send(LOADING, true)

      const update = updateEntries(entries, send, socket)

      watcher.on('change', async () => update())
      watcher.on('unlink', async () => update())
      watcher.on('raw', async (event: string, path: string, details: any) => {
        if (details.event === 'moved' && details.type === 'directory') {
          await update()
        }
      })

      update()
      send(LOADING, false)
    },
  }
}
