import * as path from 'path'
import logger from 'signale'
import WebpackDevServer from 'webpack-dev-server'

import { Plugin } from './Plugin'

import { Config as Args, Env } from './commands/args'
import { getBabelConfig, BabelRC } from './utils/babel-config'
import * as paths from './config/paths'

export interface ServerHooks {
  onPreCreateApp<A>(app: A): void
  onCreateApp<A>(app: A): void
  OnServerListening<S>(server: S): void
}

export interface BundlerServer {
  start(): Promise<WebpackDevServer>
}

export type ConfigFn<C> = (babelrc: BabelRC) => Promise<C>
export type BuildFn<C> = (config: C, dist: string, publicDir: string) => void
export type ServerFn<C> = (
  config: C,
  hooks: ServerHooks
) => BundlerServer | Promise<BundlerServer>

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

  public async mountConfig(env: Env): Promise<C> {
    const { plugins } = this.args
    const isDev = env !== 'production'
    const reduce = Plugin.reduceFromPlugins<C>(plugins)
    const babelConfig = await getBabelConfig(this.args, env)
    const userConfig = await this.config(babelConfig)
    const config = reduce('modifyBundlerConfig', userConfig, isDev, this.args)

    return this.args.modifyBundlerConfig(config, isDev, this.args)
  }

  public async createApp(config: C): Promise<BundlerServer> {
    const run = Plugin.runPluginsMethod(this.args.plugins)
    const hooks = {
      onPreCreateApp<A>(app: A): void {
        run('onPreCreateApp', app)
      },
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
    const publicDir = path.join(paths.root, this.args.public)

    if (paths.root === path.resolve(dist)) {
      logger.fatal(
        new Error(
          'Unexpected option: "dest" cannot be set to the current working directory.'
        )
      )
      process.exit(1)
    }

    await this.builder(config, dist, publicDir)
  }
}
