import { Plugin } from './Plugin'
import { ConfigArgs } from './Server'

export type TConfigFn<C> = () => C
export type TServerFn<C, S> = (config: C) => S

export interface CompilerOpts {
  args: ConfigArgs
}

export interface BundlerConstructor<C, S> extends CompilerOpts {
  id: string
  config: TConfigFn<C>
  server: TServerFn<C, S>
}

export class Bundler<C = any, S = any> {
  public readonly id: string
  private readonly args: ConfigArgs
  private config: TConfigFn<C>
  private server: TServerFn<C, S>

  constructor(params: BundlerConstructor<C, S>) {
    const { args, id, config, server } = params

    this.args = args
    this.id = id
    this.config = config
    this.server = server
  }

  public getConfig(): C {
    return this.mountConfig(this.config())
  }

  public async createServer(config: C): Promise<S> {
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

export interface Factory<C, S> {
  id: string
  config: (args: ConfigArgs) => TConfigFn<C>
  server: (args: ConfigArgs) => TServerFn<C, S>
}

export type BundlerCreate<C, S> = (args: ConfigArgs) => Bundler<C, S>

export function createBundler<C, S>(
  factory: Factory<C, S>
): BundlerCreate<C, S> {
  return (args: ConfigArgs): Bundler<C, S> =>
    new Bundler({
      args,
      config: factory.config(args),
      id: factory.id,
      server: factory.server(args),
    })
}
