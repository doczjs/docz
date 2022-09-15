import chokidar from 'chokidar';
import fs from 'fs-extra';
import { resolve } from 'path';

import type { ServerMachineCtx } from '../machine/context';

import { writeDefaultNotFound, writeNextFiles } from './create-resources';

import * as paths from '~/config/paths';

export function watchDataServer({
  args: config,
  dataServer,
  entries,
}: ServerMachineCtx) {
  return () => {
    const watcher = chokidar.watch(paths.db, {
      persistent: true,
      cwd: paths.root,
      usePolling: false,
      awaitWriteFinish: true,
    });

    async function handleCreate() {
      fs.removeSync(resolve(paths.app, 'pages'));
      await writeDefaultNotFound();
      await writeNextFiles(config);

      for (const entry of entries?.all.values() || []) {
        fs.copySync(
          entry.fullpath,
          resolve(paths.docz, `app/pages/${entry.route}.mdx`)
        );
      }
    }

    watcher.on('change', handleCreate);
    watcher.on('add', handleCreate);

    return () => {
      dataServer?.close();
      watcher.close();
    };
  };
}
