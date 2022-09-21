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
  private entries: Entries;
  private config: Config;

  constructor(entries: Entries, config: Config) {
    this.states = new Set();
    this.entries = entries;
    this.config = config;
  }

  private register(): DataServer {
    const { config, entries } = this;
    this.states.add(states.config(config));
    this.states.add(states.entries(entries, config));
    return this;
  }

  public async start() {
    this.register();
    await Promise.all(
      Array.from(this.states).map(async (state) => {
        if (!IS_DEV) return;
        await state.start();
      })
    );
  }

  public async close() {
    for (const state of this.states) {
      await state.close();
    }
  }
}
