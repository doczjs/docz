import fs from 'fs-extra';
import path from 'path';

import * as paths from '../config/paths';

import type { Config } from '~/types';

export async function copyDoczRc(defaultConfig: Config, configPath?: string) {
  const sourceDoczRc = configPath
    ? path.join(paths.root, configPath)
    : path.join(paths.root, 'doczrc.js');

  await fs.ensureDir(paths.root);
  const hasDoczRc = fs.existsSync(sourceDoczRc);
  if (!hasDoczRc) return;

  const destinationDoczRc = path.join(paths.docz, 'doczrc.js');
  await fs.copy(sourceDoczRc, destinationDoczRc);
}
