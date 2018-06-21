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

const IS_PROD = process.env.NODE_ENV === 'production'

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
    const config = this.mountConfig(this.config)
    return this.args.modifyBundlerConfig(config, !IS_PROD)
  }

  public async createServer(config: C): Promise<BundlerServer> {
    return this.server(config)
  }

  public async build(config: C): Promise<void> {
    await this.builder(config)
  }

  private mountConfig(config: C): any {
    const { plugins } = this.args
    const reduce = Plugin.reduceFromPlugins<C>(plugins)

    return reduce('modifyBundlerConfig', config, !IS_PROD)
  }
}
