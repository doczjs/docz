import { get, isFunction } from 'lodash/fp'

import { Config, BabelRC } from '../config/argv'
import { pReduce } from '../utils/p-reduce'

export type SetConfig = (config: Config) => Config | Promise<Config>

export type ModifyBundlerConfig<C = any> = (
  config: C,
  dev: boolean,
  args: Config
) => C

export type ModifyBabelRC = (babelrc: BabelRC, args: Config) => BabelRC
export type ModifyFiles = (files: string[], args: Config) => string[]

export type OnCreateWebpackChain = (
  config: any,
  dev: boolean,
  args: Config
) => void

export type onPreCreateApp = <A>(app: A) => void
export type onCreateApp = <A>(app: A) => void
export type OnServerListening = <S>(server: S) => void
export type OnPreBuild = (args: Config) => void
export type OnPostBuild = (args: Config) => void
export type OnPreRender = () => void
export type OnPostRender = () => void

export interface PluginFactory {
  setConfig?: SetConfig
  modifyBundlerConfig?: ModifyBundlerConfig
  modifyBabelRc?: ModifyBabelRC
  modifyFiles?: ModifyFiles
  onCreateWebpackChain?: OnCreateWebpackChain
  onPreCreateApp?: onPreCreateApp
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
          const fn = get<Plugin, any>(method, plugin)
          isFunction(fn) && fn(...args)
        }
      }
    }
  }

  public static propsOfPlugins(
    plugins: Plugin[]
  ): (prop: keyof Plugin) => any[] {
    return prop =>
      plugins && plugins.length > 0
        ? plugins.map(p => get(prop, p)).filter(Boolean)
        : []
  }

  public static reduceFromPlugins<C>(
    plugins: Plugin[] | undefined
  ): (method: keyof Plugin, initial: C, ...args: any[]) => C {
    return (method, initial, ...args) => {
      return [...(plugins || [])].reduce((obj: any, plugin) => {
        const fn = get<Plugin, any>(method, plugin)
        return fn && isFunction(fn) ? fn(obj, ...args) : obj
      }, initial)
    }
  }

  public static reduceFromPluginsAsync<C>(
    plugins: Plugin[] | undefined
  ): (method: keyof Plugin, initial: C, ...args: any[]) => Promise<C> {
    return (method, initial, ...args) => {
      return pReduce(
        [...(plugins || [])],
        (obj: any, plugin: any) => {
          const fn = get(method, plugin)
          return Promise.resolve(fn && isFunction(fn) ? fn(obj, ...args) : obj)
        },
        initial
      )
    }
  }

  public readonly setConfig?: SetConfig
  public readonly modifyBundlerConfig?: ModifyBundlerConfig<C>
  public readonly modifyBabelRc?: ModifyBabelRC
  public readonly modifyFiles?: ModifyFiles
  public readonly onCreateWebpackChain?: OnCreateWebpackChain
  public readonly onPreCreateApp?: onPreCreateApp
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
    this.modifyFiles = p.modifyFiles
    this.onPreCreateApp = p.onPreCreateApp
    this.onCreateWebpackChain = p.onCreateWebpackChain
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
