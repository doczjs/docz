/* eslint-disable @typescript-eslint/no-explicit-any */
import { finds } from '@docz/load-config';
import log from 'signale';
import type { StateFrom } from 'xstate';
import { interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';

import { devServerMachine } from './machine';

import { Entries } from '~/lib/Entries';
import type { Config as Args } from '~/types';

function isDataServerStarted(state: StateFrom<any>) {
  return state.matches('data.idle');
}

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

      const { context } = await waitFor(service, isDataServerStarted);
      const { args: config, dataServer, entries } = context;

      await Entries.generatePages(config, entries);
      dataServer?.onStateChange(async () => {
        await Entries.generatePages(config, entries);
      });

      process.on('exit', () => {
        service.stop();
      });
    },
  };
};
