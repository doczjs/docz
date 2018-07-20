import * as path from 'path'
import logger from 'signale'

import { Plugin } from './Plugin'

import { Config as Args, Env } from './commands/args'
import { babelrc, BabelRC } from './utils/babelrc'
import * as paths from './config/paths'

export interface Server {
  app: any
  on: (event: string, cb: (server: any) => void) => void
  close: () => void
}

export interface ServerHooks {
  onCreateApp<A>(app: A): void
  OnServerListening<S>(server: S): void
}

export interface BundlerServer {
  start(): Promise<Server>
}

export type ConfigFn<C> = (babelrc: BabelRC) => C
export type BuildFn<C> = (config: C, dist: string) => void

export type ServerFnReturn = BundlerServer | Promise<BundlerServer>
export type ServerFn<C> = (config: C, hooks: ServerHooks) => ServerFnReturn

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
    const config = this.mountConfig(this.config(babelConfig), env)

    return this.args.modifyBundlerConfig(config, !this.isProd(env), this.args)
  }

  public async createServer(config: C): Promise<BundlerServer> {
    const run = Plugin.runPluginsMethod(this.args.plugins)
    const hooks = {
      onCreateApp<A>(app: A): void {
        run('onCreateApp', app)
      },
      OnServerListening<S>(server: S): void {
        run('onServerListening', server)
      },
    }

    return this.server(config, hooks)
  }

  public async build(config: C): Promise<void> {
    const dist = paths.getDist(this.args.dest)

    if (paths.root === path.resolve(dist)) {
      logger.fatal(
        new Error(
          'Unexpected option: "dest" cannot be set to the current working directory.'
        )
      )
      process.exit(1)
    }

    await this.builder(config, dist)
  }

  private mountConfig(config: C, env: Env): any {
    const { plugins } = this.args
    const reduce = Plugin.reduceFromPlugins<C>(plugins)

    return reduce('modifyBundlerConfig', config, !this.isProd(env), this.args)
  }

  private isProd(env: Env): boolean {
    return env === 'production'
  }
}
