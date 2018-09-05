import { EntryObj } from '../Entry'
import { Config } from '../commands/args'

export { state as entries } from './entries'
export { state as config } from './config'

export interface State {
  [key: string]: any
  entries?: EntryObj
  config?: Config
}
