import { Plugin } from './Plugin'
import { ConfigArgs } from './Server'

export interface BundlerServer {
  start(): any
}

export type ConfigFn<C> = () => C
export type ServerFn<C> = (config: C) => BundlerServer

export interface CompilerOpts {
  args: ConfigArgs
}

export interface BundlerConstructor<C> extends CompilerOpts {
  id: string
  config: ConfigFn<C>
  server: ServerFn<C>
}

export class Bundler<C = any> {
  public readonly id: string
  private readonly args: ConfigArgs
  private config: ConfigFn<C>
  private server: ServerFn<C>

  constructor(params: BundlerConstructor<C>) {
    const { args, id, config, server } = params

    this.args = args
    this.id = id
    this.config = config
    this.server = server
  }

  public getConfig(): C {
    return this.mountConfig(this.config())
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

export interface Factory<C> {
  id: string
  config: (args: ConfigArgs) => ConfigFn<C>
  server: (args: ConfigArgs) => ServerFn<C>
}

export type BundlerCreate<C> = (args: ConfigArgs) => Bundler<C>

export function createBundler<C>(factory: Factory<C>): BundlerCreate<C> {
  return (args: ConfigArgs): Bundler<C> =>
    new Bundler({
      args,
      id: factory.id,
      config: factory.config(args),
      server: factory.server(args),
    })
}
