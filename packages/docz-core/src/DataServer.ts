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
    this.config = config
    this.server = new WS.Server({ server, port, host })
  }

  public async processEntries(): Promise<void> {
    const config = this.config
    const entries = new Entries(config)
    const map = await entries.getMap()
    const watcher = chokidar.watch(this.config.files, {
      ignored: /(^|[\/\\])\../,
    })

    const handleConnection = async (socket: WS) => {
      watcher.on('change', this.updateEntries)
      watcher.on('unlink', this.updateEntries)
      watcher.on('raw', (event: string, path: string, details: any) => {
        if (details.event === 'moved' && details.type === 'directory') {
          this.updateEntries(socket)
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
      watcher.on('add', this.updateConfig)
      watcher.on('change', this.updateConfig)
      watcher.on('unlink', this.updateConfig)

      this.updateConfig(socket)
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

  private async updateEntries(socket: WS): Promise<void> {
    const config = this.config

    if (isSocketOpened(socket)) {
      const newEntries = new Entries(config)
      const newMap = await newEntries.getMap()

      await Entries.rewrite(newMap)
      socket.send(this.entriesData(newMap))
    }
  }

  private updateConfig(socket: WS): void {
    const config = load('docz', {}, true)

    if (isSocketOpened(socket)) {
      socket.send(this.configData(config))
    }
  }
}
