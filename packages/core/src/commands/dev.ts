import { spawn } from 'child_process';
import { createRequire } from 'module';
import type { ArgumentsCamelCase } from 'yargs';

import { parseConfig } from '~/config/docz';
import { Artifacts } from '~/lib/Artifacts';
import { DataServer } from '~/lib/DataServer';
import { db } from '~/lib/Database';
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
  await Artifacts.generate(config);

  /** init data server */
  const dataServer = new DataServer(entries, config);
  await db.init();
  await dataServer.start();

  /** spawn astro */
  const binArgs = [
    'dev',
    `--config=${config.paths.astroConfig}`,
    `--root=${config.paths.docz}`,
  ];
  spawn(`${bin}`, binArgs, { stdio: 'inherit' });
}
