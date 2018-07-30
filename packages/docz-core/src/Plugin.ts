import get from 'lodash.get'

import { Config } from './commands/args'
import { isFn } from './utils/helpers'
import { BabelRC } from './utils/babelrc'

export type SetConfig = (config: Config) => Config
export type ModifyBundlerConfig<C = any> = (
  config: C,
  dev: boolean,
  args: Config
) => C
export type ModifyBabelRC = (babelrc: BabelRC, args: Config) => BabelRC
export type onCreateApp = <A>(app: A) => void
export type OnServerListening = <S>(server: S) => void
export type OnPreBuild = () => void
export type OnPostBuild = () => void
export type OnPreRender = () => void
export type OnPostRender = () => void

export interface PluginFactory {
  setConfig?: SetConfig
  modifyBundlerConfig?: ModifyBundlerConfig
  modifyBabelRc?: ModifyBabelRC
  onCreateApp?: onCreateApp
  onServerListening?: OnServerListening
  onPreBuild?: OnPreBuild
  onPostBuild?: OnPostBuild
  onPreRender?: OnPreRender
  onPostRender?: OnPostRender
}

export class Plugin<C = any> implements PluginFactory {
  public static runPluginsMethod(
    plugins: Plugin[] | undefined
  ): (method: keyof Plugin, ...args: any[]) => void {
    return (method, ...args) => {
      if (plugins && plugins.length > 0) {
        for (const plugin of plugins) {
          const fn = get(plugin, method)
          isFn(fn) && fn(...args)
        }
      }
    }
  }

  public static propsOfPlugins(
    plugins: Plugin[] | undefined
  ): (prop: keyof Plugin) => any {
    return prop =>
      plugins &&
      plugins.length > 0 &&
      plugins.map(p => get(p, prop)).filter(m => m)
  }

  public static reduceFromPlugins<C>(
    plugins: Plugin[] | undefined
  ): (method: keyof Plugin, initial: C, ...args: any[]) => C {
    return (method, initial, ...args) => {
      return [...(plugins || [])].reduce((obj: any, plugin) => {
        const fn = get(plugin, method)
        return fn && isFn(fn) ? fn(obj, ...args) : obj
      }, initial)
    }
  }

  public readonly setConfig?: SetConfig
  public readonly modifyBundlerConfig?: ModifyBundlerConfig<C>
  public readonly modifyBabelRc?: ModifyBabelRC
  public readonly onCreateApp?: onCreateApp
  public readonly onServerListening?: OnServerListening
  public readonly onPreBuild?: OnPreBuild
  public readonly onPostBuild?: OnPostBuild
  public readonly onPreRender?: OnPreRender
  public readonly onPostRender?: OnPostRender

  constructor(p: PluginFactory) {
    this.setConfig = p.setConfig
    this.modifyBundlerConfig = p.modifyBundlerConfig
    this.modifyBabelRc = p.modifyBabelRc
    this.onCreateApp = p.onCreateApp
    this.onServerListening = p.onServerListening
    this.onPreBuild = p.onPreBuild
    this.onPostBuild = p.onPostBuild
    this.onPreRender = p.onPreRender
    this.onPostRender = p.onPostRender
  }
}

export function createPlugin<C = any>(factory: PluginFactory): Plugin<C> {
  return new Plugin(factory)
}
