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
export type BuildFn<C> = (config: C) => void

export interface BundlerConstructor<Config> {
  args: Args
  config: Config
  server: ServerFn<Config>
  build: BuildFn<Config>
}

export class Bundler<C = any> {
  private readonly args: Args
  private config: C
  private server: ServerFn<C>
  private builder: BuildFn<C>

  constructor(params: BundlerConstructor<C>) {
    const { args, config, server, build } = params

    this.args = args
    this.config = config
    this.server = server
    this.builder = build
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

  public async build(): Promise<void> {
    this.builder(this.config)
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
