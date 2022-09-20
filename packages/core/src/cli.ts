import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import * as commands from '~/commands';
import { setArgs } from '~/config/argv';
import { setEnv } from '~/config/env';
import type { DoczArgs } from '~/types';

export function cli() {
  yargs(hideBin(process.argv))
    .scriptName('docz')
    .usage('$0 <cmd> [args]')
    .command<DoczArgs>(
      'dev',
      'initialize docz dev server',
      setArgs as any,
      async (args) => {
        setEnv('development');
        await commands.dev(args);
      }
    )
    .recommendCommands()
    .help()
    .wrap(72)
    .epilog('for more information visit https://github.com/doczjs/docz')
    .showHelpOnFail(false, 'Specify --help for available options')
    .demandCommand(1)
    .parse();
}
