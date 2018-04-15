import { isFn } from './utils/helpers'

export type IBundlerConfig = <Config>(config: Config, dev: boolean) => Config
export type IBundlerCompiler = <Compiler>(compiler: Compiler) => void
export type IBundlerServer = <Server>(server: Server) => void
export type IBeforeRender = () => void
export type IAfterRender = () => void
export type IWrapper = <R>(props: { children: any }) => R

export interface IPluginFactory {
  bundlerConfig: IBundlerConfig
  bundlerCompiler: IBundlerCompiler
  bundlerServer: IBundlerServer
  beforeRender: IBeforeRender
  afterRender: IAfterRender
  wrapper: IWrapper
}

export class Plugin {
  readonly bundlerConfig: IBundlerConfig
  readonly bundlerCompiler: IBundlerCompiler
  readonly bundlerServer: IBundlerServer
  readonly beforeRender: IBeforeRender
  readonly afterRender: IAfterRender
  readonly wrapper: IWrapper

  constructor(p: IPluginFactory) {
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

export function createPlugin(factory: IPluginFactory) {
  return new Plugin(factory)
}
