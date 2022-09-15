import { finds } from '@docz/load-config';
import log from 'signale';
import { interpret } from 'xstate';

import { devServerMachine } from './machine';

import type { Config as Args } from '~/types';

export const server = (args: Args) => async () => {
  const { findUp } = await import('find-up');
  const doczrcFilepath = await findUp(finds('docz'));
  const machine = devServerMachine.withContext({ args, doczrcFilepath });
  const service = interpret(machine).onTransition((state) => {
    if (args.debug) {
      log.debug(state.value);
    }
  });

  return {
    start: async () => {
      service.start();
      service.send('START_MACHINE');
      process.on('exit', () => {
        service.stop();
      });
    },
  };
};
