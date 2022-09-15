/* eslint-disable consistent-return */
import log from 'signale';

import type { ServerMachineCtx } from '../machine/context';

import { states } from '~/index';
import { DataServer } from '~/lib/DataServer';
import { Entries } from '~/lib/Entries';

const NODE_ENV = process.env.NODE_ENV;
const IS_DEV = NODE_ENV !== 'development';

export async function initDataServer({ args: config }: ServerMachineCtx) {
  const entries = new Entries(config);
  await entries.get();
  const dataServer = new DataServer();

  if (config.propsParser) dataServer.register([states.props(config, IS_DEV)]);
  dataServer.register([
    states.config(config, IS_DEV),
    states.entries(entries, config, IS_DEV),
  ]);

  try {
    return {
      server: dataServer.start(),
      entries,
    };
  } catch (err) {
    log.error('Failed to process data server');
    log.error(err);
    dataServer.close();
    process.exit(1);
  }
}
