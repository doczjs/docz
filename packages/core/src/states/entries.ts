/* eslint-disable @typescript-eslint/no-explicit-any */
import chokidar from 'chokidar';
import equal from 'fast-deep-equal';
import { get } from 'lodash/fp';

import { WATCH_IGNORE } from './config';

import * as paths from '~/config/paths';
import type { Params, State } from '~/lib/DataServer';
import type { Entries } from '~/lib/Entries';
import { getFilesToMatch } from '~/lib/Entries';
import type { Config } from '~/types';

const mapToArray = (map: any = []) =>
  Object.entries(map)
    .map((entry) => entry && { key: entry[0], value: entry[1] })
    .filter(Boolean);

const updateEntries = (entries: Entries) => async (p: Params) => {
  const prev = get('entries', p.getState());
  const map = await entries.get();

  if (map && !equal(prev, map)) {
    p.setState('entries', mapToArray(map));
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
    cwd: paths.root,
  });

  watcher.setMaxListeners(Infinity);

  return {
    id: 'entries',
    start: async (params) => {
      const update = updateEntries(entries);
      await update(params);

      if (dev) {
        watcher.on('add', async () => {
          await update(params);
        });
        watcher.on('change', async () => {
          await update(params);
        });
        watcher.on('unlink', async () => {
          await update(params);
        });
        watcher.on(
          'raw',
          async (_event: string, _path: string, details: any) => {
            if (details.event === 'moved' && details.type === 'directory') {
              await update(params);
            }
          }
        );
      }
    },
    close: () => {
      watcher.close();
    },
  };
};
