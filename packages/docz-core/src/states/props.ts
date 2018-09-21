import { State } from '../DataServer'
import { Config } from '../commands/args'

import { Entries } from '../Entries'

export const state = (entries: Entries, config: Config): State => {
  return {
    init: async params => {
      return null
    },
    update: async params => {
      return () => null
    },
  }
}
