import { interpret } from 'xstate'

import { Config as Args } from '../config/argv'
import { ServerHooks as Hooks } from '../lib/Bundler'
import { devServerMachine } from '../machines/devServer'

export const server = (args: Args) => async (config: any, hooks: Hooks) => ({
  start: async () => {
    const machine = devServerMachine.withContext({ args, config })
    const service = interpret(machine).onTransition(state => {
      args.debug && console.log(state.value)
    })

    service.start()
    service.send('INITIALIZE')
  },
})
