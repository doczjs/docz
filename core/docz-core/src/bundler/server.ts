import { interpret } from 'xstate'

import { Config as Args } from '../config/argv'
import { ServerHooks as Hooks } from '../lib/Bundler'
import { devServerMachine } from './machine'

export const server = (args: Args) => async (config: any, hooks: Hooks) => ({
  start: async () => {
    const machine = devServerMachine.withContext({ args, config })
    const service = interpret(machine)

    service.start()
    service.send('INITIALIZE')
  },
})
