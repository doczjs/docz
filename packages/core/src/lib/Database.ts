/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */
import lodash from 'lodash';
import { Low, JSONFile } from 'lowdb';

import { paths } from '~/config';
import type { ConfigObj, EntryObj } from '~/types';

type Data = {
  entries: EntryObj[];
  config: ConfigObj;
  // TODO: type here alter
  props: any;
};

class DBInstance<T> extends Low<T> {
  chain: lodash.ExpChain<this['data']> = lodash.chain(this).get('data');
}

export class Database {
  private db: DBInstance<Data>;

  constructor() {
    const adapter = new JSONFile<Data>(paths.db);
    this.db = new DBInstance(adapter);
  }

  get(prop: string) {
    return this.db.data![prop];
  }

  async set(prop: string, val: any) {
    this.db.data![prop] = val;
    await this.db.write();
  }

  async init() {
    await this.db.read();
    this.db.data ||= { entries: [], config: {} as any, props: {} };
  }

  async save() {
    await this.db.write();
  }
}

export const db = new Database();
