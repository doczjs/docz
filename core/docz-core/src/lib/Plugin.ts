import { get, isFunction } from 'lodash/fp'

import { Config } from '../config/argv'
import { pReduce } from '../utils/p-reduce'

export type SetConfig = (config: Config) => Config | Promise<Config>
export type ModifyFiles = (files: string[], args: Config) => string[]

export interface PluginFactory {
  setConfig?: SetConfig
  modifyFiles?: ModifyFiles
}

export class Plugin<C = any> implements PluginFactory {
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
  public readonly modifyFiles?: ModifyFiles

  constructor(p: PluginFactory) {
    this.setConfig = p.setConfig
    this.modifyFiles = p.modifyFiles
  }
}

export function createPlugin<C = any>(factory: PluginFactory): Plugin<C> {
  return new Plugin(factory)
}
