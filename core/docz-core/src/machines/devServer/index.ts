import { Machine } from 'xstate'

import { ServerMachineCtx } from './context'
import * as services from './services'
import * as actions from './actions'

const machine = Machine<ServerMachineCtx>({
  id: 'devServer',
  type: 'parallel',
  states: {
    server: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            INITIALIZE: {
              actions: ['assignFirstInstall', 'checkIsDoczRepo'],
              target: 'ensuringDirs',
            },
          },
        },
        ensuringDirs: {
          invoke: {
            src: 'ensureDirs',
            onDone: 'creatingResources',
          },
        },
        creatingResources: {
          invoke: {
            src: 'createResources',
            onDone: 'installingDeps',
            onError: 'exiting',
          },
        },
        installingDeps: {
          invoke: {
            src: 'installDeps',
            onDone: 'executingCommand',
            onError: 'exiting',
          },
        },
        executingCommand: {
          invoke: {
            src: 'execDevCommand',
            // onDone: {
            //   actions: 'openBrowser',
            // },
            onError: 'exiting',
          },
        },
        exiting: {
          onEntry: 'logError',
          type: 'final',
        },
      },
    },
  },
})

export const devServerMachine = machine.withConfig({
  services,
  actions,
})
