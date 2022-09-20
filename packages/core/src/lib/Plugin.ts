import _ from 'lodash';

import type { Config } from '~/types';
import { pReduce } from '~/utils/p-reduce';

type Entry = {
  id: string;
};

export type SetConfig = (config: Config) => Config | Promise<Config>;
export type ModifyFiles = (files: string[], args: Config) => string[];
export type ModifyEntry = (entry: Entry, args: Config) => Entry;

export interface PluginFactory {
  setConfig?: SetConfig;
  modifyFiles?: ModifyFiles;
  modifyEntry?: ModifyEntry;
}

export class Plugin implements PluginFactory {
  public static runPluginsMethod(
    plugins: Plugin[] | undefined
  ): (method: keyof Plugin, ...args: any[]) => void {
    return (method, ...args) => {
      if (plugins && plugins.length > 0) {
        for (const plugin of plugins) {
          const fn = _.get<Plugin, any>(plugin, method);
          if (_.isFunction(fn)) {
            fn(...args);
          }
        }
      }
    };
  }

  public static propsOfPlugins(
    plugins: Plugin[]
  ): (prop: keyof Plugin) => any[] {
    return (prop) =>
      plugins && plugins.length > 0
        ? plugins.map((p) => _.get(p, prop)).filter(Boolean)
        : [];
  }

  public static reduceFromPlugins<C>(
    plugins: Plugin[] | undefined
  ): (method: keyof Plugin, initial: C, ...args: any[]) => C {
    return (method, initial, ...args) => {
      return [...(plugins || [])].reduce((obj: any, plugin) => {
        const fn: any = _.get<Plugin, any>(plugin, method);
        return fn && _.isFunction(fn) ? fn(obj, ...args) : obj;
      }, initial);
    };
  }

  public static reduceFromPluginsAsync<C>(
    plugins: Plugin[] | undefined
  ): (method: keyof Plugin, initial: C, ...args: any[]) => Promise<C> {
    return (method, initial, ...args) => {
      return pReduce(
        [...(plugins || [])],
        (obj: any, plugin: any) => {
          const fn: any = _.get(method, plugin);
          return Promise.resolve(
            fn && _.isFunction(fn) ? fn(obj, ...args) : obj
          );
        },
        initial
      );
    };
  }

  public readonly setConfig?: SetConfig;
  public readonly modifyFiles?: ModifyFiles;
  public readonly modifyEntry?: ModifyEntry;

  constructor(p: PluginFactory) {
    this.setConfig = p.setConfig;
    this.modifyFiles = p.modifyFiles;
    this.modifyEntry = p.modifyEntry;
  }
}

export function createPlugin(factory: PluginFactory) {
  return new Plugin(factory);
}
