import { Plugin } from './Plugin'

import { Config as Args, Env } from './commands/args'
import { babelrc, BabelRC } from './utils/babelrc'
import * as paths from './config/paths'

export interface Server {
  app: any
  on: (event: string, cb: (server: any) => void) => void
  close: () => void
}

export interface BundlerServer {
  start(): Promise<Server>
}

export type ConfigFn<C> = (babelrc: BabelRC) => C
export type ServerFn<C> = (config: C) => BundlerServer | Promise<BundlerServer>
export type BuildFn<C> = (config: C, dist: string) => void

export interface BundlerConstructor<Config> {
  args: Args
  config: ConfigFn<Config>
  server: ServerFn<Config>
  build: BuildFn<Config>
}

export interface ConfigObj {
  [key: string]: any
}

export class Bundler<C = ConfigObj> {
  private readonly args: Args
  private config: ConfigFn<C>
  private server: ServerFn<C>
  private builder: BuildFn<C>

  constructor(params: BundlerConstructor<C>) {
    const { args, config, server, build } = params

    this.args = args
    this.config = config
    this.server = server
    this.builder = build
  }

  public getConfig(env: Env): C {
    const babelConfig = babelrc(this.args, env)
    const config = this.mountConfig(this.config(babelConfig))

    return this.args.modifyBundlerConfig(config, !this.isProd(), this.args)
  }

  public async createServer(config: C): Promise<BundlerServer> {
    return this.server(config)
  }

  public async build(config: C): Promise<void> {
    const dist = paths.getDist(this.args.dest)
    await this.builder(config, dist)
  }

  private mountConfig(config: C): any {
    const { plugins } = this.args
    const reduce = Plugin.reduceFromPlugins<C>(plugins)

    return reduce('modifyBundlerConfig', config, !this.isProd(), this.args)
  }

  private isProd(): boolean {
    return process.env.NODE_ENV === 'production'
  }
}
