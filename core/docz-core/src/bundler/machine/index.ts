import { createMachine } from 'xstate'

import { ServerMachineCtx } from './context'
import * as services from './services'
import * as actions from './actions'

const asyncState = (src: string, onDoneTarget?: string) =>
  ({
    initial: 'exec',
    states: {
      exec: {
        invoke: {
          src,
          onDone: 'success',
          onError: 'failure',
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
  } as const)

const machine = createMachine<ServerMachineCtx>({
  id: 'devServer',
  type: 'parallel',
  states: {
    watch: {
      onEntry: 'ensureFiles',
      invoke: {
        src: 'watchFiles',
      },
    },
    server: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            START_MACHINE: {
              actions: ['assignFirstInstall', 'checkIsDoczRepo'],
              target: 'ensuringDirs',
            },
          },
        },
        ensuringDirs: asyncState('ensureDirs', 'creatingResources'),
        creatingResources: asyncState('createResources', 'executingCommand'),
        executingCommand: asyncState('execDevCommand'),
        exit: {
          type: 'final',
        },
      },
    },
  },
})

export const devServerMachine = machine.withConfig({
  services,
  actions,
} as any)
