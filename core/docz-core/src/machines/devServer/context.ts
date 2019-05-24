import { Config } from '../../config/argv'

export interface ServerMachineCtx {
  args: Config
  config: any
  doczrcFilepath: string
  firstInstall?: boolean
  isDoczRepo?: boolean
}
