import { interpret } from 'xstate'
import { finds } from 'load-cfg'
import findUp from 'find-up'

import { devServerMachine } from './machine'
import { Config as Args } from '../config/argv'

export const server = (args: Args) => async () => {
  const doczrcFilepath = await findUp(finds('docz'))
  const machine = devServerMachine.withContext({ args, doczrcFilepath })
  const service = interpret(machine).onTransition(state => {
    if (args.debug) {
      console.log(state.value)
    }
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
