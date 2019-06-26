import { interpret } from 'xstate'
import { finds } from 'load-cfg'
import findUp from 'find-up'

import { Config as Args } from '../config/argv'
import { ServerHooks as Hooks } from '../lib/Bundler'
import { devServerMachine } from '../machines/devServer'

export const server = (args: Args) => async (config: any, _hooks: Hooks) => {
  const doczrcFilepath = await findUp(finds('docz'))
  const machine = devServerMachine.withContext({
    args,
    config,
    doczrcFilepath,
  })

  const service = interpret(machine).onTransition(state => {
    args.debug && console.log(state.value)
  })

  return {
    start: async () => {
      service.start()
      service.send('START_MACHINE')
      process.on('exit', () => {
        service.stop()
      })
    },
  }
}
