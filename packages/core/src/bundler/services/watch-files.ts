import * as fs from 'fs-extra';
import * as path from 'path';

import type { ServerMachineCtx as Context } from '../machine/context';

import * as paths from '~/config/paths';
import { createWatcher } from '~/states/config';

const watchDoczRc = (args: Context['args']) => {
  const watcher = createWatcher(
    path.join(paths.root, args.config ? args.config : 'doczrc.js'),
    args
  );

  const copy = (filepath: string) => {
    const src = path.resolve(paths.root, filepath);
    const dest = path.resolve(paths.docz, 'doczrc.js');
    fs.copySync(src, dest);
  };

  const remove = () => {
    fs.removeSync(path.resolve(paths.docz, 'doczrc.js'));
  };

  watcher.on('add', copy).on('change', copy).on('unlink', remove);
  return () => watcher.close();
};

export const watchFiles =
  ({ args }: Context) =>
  () => {
    const doczrc = watchDoczRc(args);

    return () => {
      doczrc();
    };
  };
