import { Plugin } from './Plugin'
import { ConfigArgs } from './Server'

export type TConfigFn<C> = () => C
export type TCompilerFn<C> = (config: C) => Promise<any>
export type TServerFn<S> = (compiler: any) => S

export interface ICompilerOpts {
  args: ConfigArgs
}

export interface IBundlerConstructor<C, S> extends ICompilerOpts {
  id: string
  config: TConfigFn<C>
  compiler: TCompilerFn<C>
  server: TServerFn<S>
}

export class Bundler<C = any, S = any> {
  readonly id: string
  readonly args: ConfigArgs
  private config: TConfigFn<C>
  private compiler: TCompilerFn<C>
  private server: TServerFn<S>

  constructor(params: IBundlerConstructor<C, S>) {
    const { args, id, config, compiler, server } = params

    this.args = args
    this.id = id
    this.config = config
    this.compiler = compiler
    this.server = server
  }

  private reduceWithPlugins(dev: boolean) {
    return (config: C, plugin: Plugin) =>
      plugin.bundlerConfig(config, dev) || config
  }

  private mountConfig() {
    const { plugins, env } = this.args

    const dev = env === 'development'
    const initialConfig = this.config()

    return Boolean(plugins) && plugins.length > 0
      ? plugins.reduce(this.reduceWithPlugins(dev), initialConfig)
      : initialConfig
  }

  public async createCompiler() {
    return await this.compiler(this.mountConfig())
  }

  public async createServer(compiler: any): Promise<S> {
    return await this.server(compiler)
  }
}

export interface IFactory<C, S> {
  id: string
  config: (args: ConfigArgs) => TConfigFn<C>
  compiler: (args: ConfigArgs) => TCompilerFn<C>
  server: (args: ConfigArgs) => TServerFn<S>
}

export interface IBundlerCreate<C, S> {
  (args: ConfigArgs): Bundler<C, S>
}

export function createBundler<C, S>(
  factory: IFactory<C, S>
): IBundlerCreate<C, S> {
  return (args: ConfigArgs): Bundler<C, S> =>
    new Bundler({
      args,
      id: factory.id,
      config: factory.config(args),
      compiler: factory.compiler(args),
      server: factory.server(args),
    })
}
