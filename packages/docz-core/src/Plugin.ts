import { isFn } from './utils/helpers'

export type BundlerConfig = <Config>(config: Config, dev: boolean) => Config
export type BundlerCompiler = <Compiler>(compiler: Compiler) => void
export type BundlerServer = <Server>(server: Server) => void
export type BeforeRender = () => void
export type AfterRender = () => void
export type Wrapper = <R>(props: { children: any }) => R

export interface PluginFactory {
  bundlerConfig: BundlerConfig
  bundlerCompiler: BundlerCompiler
  bundlerServer: BundlerServer
  beforeRender: BeforeRender
  afterRender: AfterRender
  wrapper: Wrapper
}

export class Plugin {
  public readonly bundlerConfig: BundlerConfig
  public readonly bundlerCompiler: BundlerCompiler
  public readonly bundlerServer: BundlerServer
  public readonly beforeRender: BeforeRender
  public readonly afterRender: AfterRender
  public readonly wrapper: Wrapper

  constructor(p: PluginFactory) {
    this.bundlerConfig = (config: any, dev: boolean) => {
      return isFn(p.bundlerConfig) && p.bundlerConfig(config, dev)
    }

    this.bundlerCompiler = async (compiler: any) => {
      isFn(p.bundlerCompiler) && (await p.bundlerCompiler(compiler))
    }

    this.bundlerServer = async (server: any) => {
      isFn(p.bundlerServer) && (await p.bundlerServer(server))
    }

    this.beforeRender = p.beforeRender
    this.afterRender = p.afterRender
    this.wrapper = p.wrapper
  }
}

export function createPlugin(factory: PluginFactory): Plugin {
  return new Plugin(factory)
}
