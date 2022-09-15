import * as fs from 'fs-extra';
import * as path from 'path';

import * as paths from '~/config/paths';

export const ensureDirs = async () => {
  await fs.ensureDir(paths.docz);
  return fs.ensureDir(path.join(paths.app, 'pages'));
};
