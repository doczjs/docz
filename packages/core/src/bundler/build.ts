import * as fs from 'fs-extra';
import * as path from 'path';
import sh from 'shelljs';

import * as paths from '../config/paths';
import type { BuildFn } from '../lib/Bundler';
import { spawnSync } from '../utils/spawn';

import { ensureFiles } from './machine/actions';

export const build: BuildFn = async (config, dist) => {
  const publicDir = path.join(paths.docz, 'public');
  const cliArgs = ['run', 'build'];
  ensureFiles({ args: config });
  sh.cd(paths.docz);
  spawnSync('npm', cliArgs);
  await fs.copy(publicDir, dist);
};
