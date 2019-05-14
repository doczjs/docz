import { Config } from '../../config/argv'

export interface ServerMachineCtx {
  args: Config
  config: any
  firstInstall?: boolean
  isDoczRepo?: boolean
}
