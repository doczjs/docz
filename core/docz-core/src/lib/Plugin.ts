import { get, isFunction } from 'lodash/fp'

import { pReduce } from '../utils/p-reduce'
import { Config } from '../config/argv'

export type SetConfig = (config: Config) => Config | Promise<Config>
export type onCreateBabelConfig = (params: any, dev: boolean) => void

export type onCreateWebpackConfig<C = any> = (
  config: C,
  dev: boolean,
  args: Config
) => C

export type ModifyFiles = (files: string[], args: Config) => string[]
export type onCreateDevServer = <A>(app: A) => void
export type OnPreBuild = (args: Config) => void
export type OnPostBuild = (args: Config) => void
export type OnPreRender = () => void
export type OnPostRender = () => void

export interface PluginFactory {
  setConfig?: SetConfig
  onCreateBabelConfig?: onCreateBabelConfig
  onCreateDevServer?: onCreateDevServer
  onCreateWebpackConfig?: onCreateWebpackConfig
  modifyFiles?: ModifyFiles
  onPreBuild?: OnPreBuild
  onPostBuild?: OnPostBuild
}

export class Plugin<C = any> implements PluginFactory {
  public static runPluginsMethod(
    plugins: Plugin[] | undefined
  ): (method: keyof Plugin, ...args: any[]) => void {
    return (method, ...args) => {
      if (plugins && plugins.length > 0) {
        for (const plugin of plugins) {
          const fn = get<Plugin, any>(method, plugin)
          if (isFunction(fn)) {
            fn(...args)
          }
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
  public readonly onCreateWebpackConfig?: onCreateWebpackConfig<C>
  public readonly onCreateBabelConfig?: onCreateBabelConfig
  public readonly modifyFiles?: ModifyFiles
  public readonly onCreateDevServer?: onCreateDevServer
  public readonly onPreBuild?: OnPreBuild
  public readonly onPostBuild?: OnPostBuild

  constructor(p: PluginFactory) {
    this.setConfig = p.setConfig
    this.onCreateWebpackConfig = p.onCreateWebpackConfig
    this.onCreateBabelConfig = p.onCreateBabelConfig
    this.modifyFiles = p.modifyFiles
    this.onCreateDevServer = p.onCreateDevServer
    this.onPreBuild = p.onPreBuild
    this.onPostBuild = p.onPostBuild
  }
}

export function createPlugin<C = any>(factory: PluginFactory): Plugin<C> {
  return new Plugin(factory)
}
