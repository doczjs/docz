import type { DataServer } from '~/lib/DataServer';
import type { Entries } from '~/lib/Entries';
import type { Config } from '~/types';

export interface ServerMachineCtx {
  args: Config;
  doczrcFilepath?: string;
  dataServer?: DataServer;
  entries?: Entries;
}
