/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from 'signale';
import type { Arguments } from 'yargs';

import { bundler as next } from '~/bundler';
import { copyDoczRc } from '~/bundler/services';
import { parseConfig } from '~/config/docz';

process.setMaxListeners(Infinity);

export const dev = async (args: Arguments<any>) => {
  copyDoczRc(args.config);
  const config = await parseConfig(args);
  const bundler = next(config);
  const app = await bundler.createApp();

  try {
    app.start();
  } catch (err) {
    logger.fatal('Failed to process data server');
    logger.error(err);
    process.exit(1);
  }
};
