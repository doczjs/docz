/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs-extra';
import _ from 'lodash';

import * as paths from '../config/paths';
import * as states from '../states';

import type { Entries } from './Entries';
import type { State } from './State';

import type { Config } from '~/types';
import * as envDotProp from '~/utils/env';

const IS_DEV = envDotProp.get('NODE_ENV') !== 'production';

export interface Action {
  type: string;
  payload: any;
}

export type Listener = (action: Action) => void;

export class DataServer {
  private states: Set<State>;
  private state: Map<string, any>;
  private listeners: Set<Listener>;
  private entries: Entries;
  private config: Config;

  constructor(entries: Entries, config: Config) {
    this.states = new Set();
    this.state = new Map();
    this.listeners = new Set<Listener>();
    this.entries = entries;
    this.config = config;
  }

  private register(): DataServer {
    const { config, entries } = this;
    if (config.propsParser) this.states.add(states.props(config, IS_DEV));
    this.states.add(states.config(config, IS_DEV));
    this.states.add(states.entries(entries, config, IS_DEV));
    return this;
  }

  public async start() {
    this.register();
    await Promise.all(
      Array.from(this.states).map(async (state) => {
        if (!_.isFunction(state.start)) return;
        // eslint-disable-next-line consistent-return
        return state.start({
          setState: this.setState.bind(this),
          getState: this.getState.bind(this),
        });
      })
    );

    return this;
  }

  public close(): void {
    for (const state of this.states) {
      if (_.isFunction(state.close)) {
        state.close();
        this.listeners = new Set();
      }
    }
  }

  public onStateChange(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.clear();
  }

  public getState() {
    return this.mapToObject<any>(this.state);
  }

  private setState(key: string, val: any) {
    const prev = _.get(this.getState(), key);
    const next = typeof val === 'function' ? val(prev) : val;

    this.state.set(key, next);
    this.writeDbFile();
    this.listeners.forEach((listener) => {
      listener({ type: `state.${key}`, payload: next });
    });
  }

  public async writeDbFile() {
    await this.entries.populate(this.config);
    fs.outputJSONSync(paths.db, this.mapToObject(this.state), { spaces: 2 });
  }

  private mapToObject<T>(map: Map<string, any>): T {
    return Array.from(map.entries()).reduce(
      (obj, [key, val]) => ({ ...obj, [key]: val }),
      {} as T
    );
  }
}
