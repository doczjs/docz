/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs-extra';
import path from 'path';

import * as paths from '~/config/paths';
import { createWatcher } from '~/states/config';
import type { Config } from '~/types';

export const createWatch =
  (args: Config) => (glob: any, src: string, custom?: boolean) => {
    const watcher = createWatcher(glob, args);
    const srcPath = path.join(paths.root, src);
    const destPath = path.join(
      paths.docz,
      custom ? src.replace('.js', '.custom.js') : src
    );

    const copyFile = () => fs.copySync(srcPath, destPath);
    const deleteFile = () => fs.removeSync(destPath);

    watcher.on('add', copyFile).on('change', copyFile).on('unlink', deleteFile);

    return () => watcher.close();
  };
