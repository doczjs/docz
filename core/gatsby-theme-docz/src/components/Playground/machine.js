import { Machine, assign } from 'xstate'

const actions = {
  changeCode: assign((ctx, ev) => ({
    code: ev.data,
  })),
}

const machine = Machine({
  id: 'playground',
  initial: 'idle',
  states: {
    idle: {
      on: {
        CHANGE: {
          actions: ['changeCode'],
        },
      },
    },
  },
})

export default machine.withConfig({
  actions,
})
