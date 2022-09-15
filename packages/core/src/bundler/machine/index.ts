/* eslint-disable @typescript-eslint/no-explicit-any */
import { createMachine } from 'xstate';

import * as services from '../services';

import * as actions from './actions';
import type { ServerMachineCtx } from './context';

const asyncState = (src: string, onDoneTarget?: string) => ({
  initial: 'exec',
  states: {
    exec: {
      invoke: {
        src,
        onDone: {
          target: 'success',
        },
        onError: {
          target: 'failure',
        },
      },
    },
    success: {
      type: 'final',
    },
    failure: {
      actions: ['logError'],
      type: 'final',
    },
  },
  onDone: {
    target: onDoneTarget || 'exit',
  },
});

const machine = createMachine<ServerMachineCtx>({
  predictableActionArguments: true,
  id: 'devServer',
  type: 'parallel',
  schema: {
    context: {} as ServerMachineCtx,
  },
  states: {
    watch: {
      entry: ['ensureFiles'],
      invoke: {
        src: 'watchFiles',
      },
    },
    data: {
      initial: 'initing',
      states: {
        initing: {
          invoke: {
            src: 'initDataServer',
            onDone: {
              actions: 'assignDataServer',
              target: 'watching',
            },
          },
        },
        watching: {
          invoke: {
            src: 'watchDataServer',
          },
        },
      },
    },
    server: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            START_MACHINE: {
              target: 'ensuringDirs',
            },
          },
        },
        ensuringDirs: {
          ...(asyncState('ensureDirs', 'creatingResources') as any),
        },
        creatingResources: {
          ...(asyncState('createResources', 'executingCommand') as any),
        },
        executingCommand: {
          ...(asyncState('execNext') as any),
        },
        exit: {
          type: 'final',
        },
      },
    },
  },
});

export const devServerMachine = machine.withConfig({
  services,
  actions,
} as any);
