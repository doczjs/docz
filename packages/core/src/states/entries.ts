import chokidar from 'chokidar';
import equal from 'fast-deep-equal';

import { WATCH_IGNORE } from './config';

import { db } from '~/lib/Database';
import type { Entries } from '~/lib/Entries';
import { getFilesToMatch } from '~/lib/Entries';
import { State } from '~/lib/State';
import type { Config } from '~/types';

function createWatcher(config: Config) {
  const ignored = config.watchIgnore || WATCH_IGNORE;
  const watcher = chokidar.watch(getFilesToMatch(config), {
    ignored,
    persistent: true,
    cwd: config.paths.root,
  });

  watcher.setMaxListeners(Infinity);
  return watcher;
}

export const state = (entries: Entries, config: Config) => {
  const watcher = createWatcher(config);

  async function update() {
    const prev = db.get('entries');
    const map = await entries.getAll();
    const curr = Array.from(map.values());

    if (curr && !equal(prev, curr)) {
      await db.set('entries', curr);
    }
  }

  return new State('entries', {
    watcher,
    async onAll() {
      await entries.populate(config);
      await update();
    },
    async onDelete(filepath) {
      entries.remove(filepath);
      await update();
    },
  });
};
