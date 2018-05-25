import { load, finds } from 'load-cfg'
import chokidar from 'chokidar'
import WS from 'ws'

import { Config } from './commands/args'
import { Entries, EntryMap } from './Entries'

const isSocketOpened = (socket: WS) => socket.readyState === WS.OPEN

export interface DataServerOpts {
  server: any
  port: number
  host: string
  config: Config
}

export class DataServer {
  private server: WS.Server
  private config: Config

  constructor({ server, port, host, config }: DataServerOpts) {
    this.server = new WS.Server({
      server,
      port,
      host,
    })

    this.config = {
      ...config,
      websocketPort: port,
    }
  }

  public async processEntries(): Promise<void> {
    const config = this.config
    const entries = new Entries(config)
    const map = await entries.getMap()
    const watcher = chokidar.watch(this.config.files, {
      ignored: /(^|[\/\\])\../,
    })

    const handleConnection = (socket: WS) => {
      const update = this.updateEntries(socket)

      watcher.on('change', async () => update(this.config))
      watcher.on('unlink', async () => update(this.config))
      watcher.on('raw', async (event: string, path: string, details: any) => {
        if (details.event === 'moved' && details.type === 'directory') {
          await update(this.config)
        }
      })

      socket.send(this.entriesData(map))
    }

    this.server.on('connection', handleConnection)
    this.server.on('close', () => watcher.close())

    await Entries.write(config, map)
  }

  public async processThemeConfig(): Promise<void> {
    const watcher = chokidar.watch(finds('docz'))

    const handleConnection = async (socket: WS) => {
      const update = this.updateConfig(socket)

      watcher.on('add', update)
      watcher.on('change', update)
      watcher.on('unlink', update)

      update()
    }

    this.server.on('connection', handleConnection)
    this.server.on('close', () => watcher.close())
  }

  private dataObj(type: string, data: any): string {
    return JSON.stringify({ type, data })
  }

  private entriesData(entries: EntryMap): string {
    return this.dataObj('docz.entries', entries)
  }

  private configData(config: Config): string {
    return this.dataObj('docz.config', config.themeConfig)
  }

  private updateEntries(socket: WS): (config: Config) => Promise<void> {
    return async config => {
      if (isSocketOpened(socket)) {
        const newEntries = new Entries(config)
        const newMap = await newEntries.getMap()

        await Entries.rewrite(newMap)
        socket.send(this.entriesData(newMap))
      }
    }
  }

  private updateConfig(socket: WS): () => void {
    const config = load('docz', {}, true)

    return () => {
      if (isSocketOpened(socket)) {
        socket.send(this.configData(config))
      }
    }
  }
}
