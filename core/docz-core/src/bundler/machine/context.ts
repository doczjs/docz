import { Config } from '../../config/argv'

export interface ServerMachineCtx {
  args: Config
  doczrcFilepath?: string
  firstInstall?: boolean
  isDoczRepo?: boolean
}
