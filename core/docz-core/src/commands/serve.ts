import spawn from 'cross-spawn'
import { Arguments } from 'yargs'
import { parseConfig } from '../config/docz'
import * as paths from '../config/paths'

export const serve = async (args: Arguments<any>) => {
  const config = await parseConfig(args)
  const dist = paths.getDist(config.dest)

  spawn.sync('serve', ['-s', dist], { stdio: 'inherit' })
}
