import { Plugin } from './Plugin'
import { ConfigArgs } from './Server'

export type TConfigFn<C> = () => C
export type TCompilerFn<C> = (config: C) => any
export type TServerFn<S> = (compiler: any) => S

export interface CompilerOpts {
  args: ConfigArgs
}

export interface BundlerConstructor<C, S> extends CompilerOpts {
  id: string
  config: TConfigFn<C>
  compiler: TCompilerFn<C>
  server: TServerFn<S>
}

export class Bundler<C = any, S = any> {
  public readonly id: string
  private readonly args: ConfigArgs
  private config: TConfigFn<C>
  private compiler: TCompilerFn<C>
  private server: TServerFn<S>

  constructor(params: BundlerConstructor<C, S>) {
    const { args, id, config, compiler, server } = params

    this.args = args
    this.id = id
    this.config = config
    this.compiler = compiler
    this.server = server
  }

  public async createCompiler(): Promise<any> {
    return this.compiler(this.mountConfig())
  }

  public async createServer(compiler: any): Promise<S> {
    return this.server(compiler)
  }

  private reduceWithPlugins(dev: boolean): any {
    return (config: C, plugin: Plugin) =>
      plugin.bundlerConfig(config, dev) || config
  }

  private mountConfig(): C {
    const { plugins, env } = this.args

    const dev = env === 'development'
    const initialConfig = this.config()

    return plugins && plugins.length > 0
      ? plugins.reduce(this.reduceWithPlugins(dev), initialConfig)
      : initialConfig
  }
}

export interface Factory<C, S> {
  id: string
  config: (args: ConfigArgs) => TConfigFn<C>
  compiler: (args: ConfigArgs) => TCompilerFn<C>
  server: (args: ConfigArgs) => TServerFn<S>
}

export type BundlerCreate<C, S> = (args: ConfigArgs) => Bundler<C, S>

export function createBundler<C, S>(
  factory: Factory<C, S>
): BundlerCreate<C, S> {
  return (args: ConfigArgs): Bundler<C, S> =>
    new Bundler({
      args,
      compiler: factory.compiler(args),
      config: factory.config(args),
      id: factory.id,
      server: factory.server(args),
    })
}
