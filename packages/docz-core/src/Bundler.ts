import { Plugin } from './Plugin'
import { Config as Args } from './commands/args'

export interface Server {
  close: () => void
  on: (event: string, cb: (server: any) => void) => void
}

export interface BundlerServer {
  start(): Promise<Server>
}

export type ServerFn<C> = (config: C) => BundlerServer | Promise<BundlerServer>

export interface BundlerConstructor<Config> {
  args: Args
  config: Config
  server: ServerFn<Config>
}

export class Bundler<C = any> {
  private readonly args: Args
  private config: C
  private server: ServerFn<C>

  constructor(params: BundlerConstructor<C>) {
    const { args, config, server } = params

    this.args = args
    this.config = config
    this.server = server
  }

  public getConfig(): C {
    return this.mountConfig(this.config)
  }

  public async createServer(config: C): Promise<BundlerServer> {
    const { plugins } = this.args
    const server = await this.server(config)

    if (plugins && plugins.length > 0) {
      for (const plugin of plugins) {
        await plugin.bundlerServer(server)
      }
    }

    return server
  }

  private reduceWithPlugins(dev: boolean): any {
    return (config: C, plugin: Plugin) =>
      plugin.bundlerConfig(config, dev) || config
  }

  private mountConfig(config: C): C {
    const { plugins, env } = this.args
    const dev = env === 'development'

    return plugins && plugins.length > 0
      ? plugins.reduce(this.reduceWithPlugins(dev), config)
      : config
  }
}
