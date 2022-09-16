import chokidar from 'chokidar';
import equal from 'fast-deep-equal';
import _ from 'lodash';

import { WATCH_IGNORE } from './config';

import type { Entries } from '~/lib/Entries';
import { getFilesToMatch } from '~/lib/Entries';
import type { Params } from '~/lib/State';
import { State } from '~/lib/State';
import type { Config } from '~/types';

const updateEntries = (entries: Entries) => async (p: Params) => {
  const prev = _.get(p.getState(), 'entries', []);
  const map = await entries.getAll();
  const curr = Array.from(map.values());

  if (curr && !equal(prev, curr)) {
    p.setState('entries', curr);
  }
};

export const state = (
  entries: Entries,
  config: Config,
  dev?: boolean
): State => {
  const ignored = config.watchIgnore || WATCH_IGNORE;
  const watcher = chokidar.watch(getFilesToMatch(config), {
    ignored,
    persistent: true,
    cwd: config.paths.root,
  });

  watcher.setMaxListeners(Infinity);

  return new State('entries', {
    start: async (params) => {
      const update = updateEntries(entries);
      await update(params);

      if (dev) {
        watcher.on('all', async () => {
          await entries.populate(config);
          await update(params);
        });
        watcher.on('unlink', async (file) => {
          entries.remove(file);
          await update(params);
        });
      }
    },
    close: () => {
      watcher.close();
    },
  });
};
