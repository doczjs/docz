import { spawn } from 'child_process';
import { createRequire } from 'module';
import type { ArgumentsCamelCase } from 'yargs';

import { parseConfig } from '~/config/docz';
import { AstroFiles } from '~/lib/AstroFiles';
import { DataServer } from '~/lib/DataServer';
import { Entries } from '~/lib/Entries';
import type { DoczArgs } from '~/types';

export async function dev(args: ArgumentsCamelCase<DoczArgs>) {
  const config = await parseConfig(args);
  const require = createRequire(import.meta.url);
  const bin = require.resolve('astro');

  /** create entries */
  const entries = new Entries();
  await entries.populate(config);

  /** generate base files */
  await AstroFiles.baseFiles(config);
  // await AstroFiles.entryFiles(config, entries);

  /** init data server */
  const dataServer = new DataServer(entries, config);
  await dataServer.start();

  /** spawn astro */
  const binArgs = [
    'dev',
    `--config=${config.paths.astroConfig}`,
    `--root=${config.paths.docz}`,
  ];
  spawn(`${bin}`, binArgs, { stdio: 'inherit' });
}
