import findUp from 'find-up'

import * as paths from '../../config/paths'
import { Config } from '../../config/argv'
import { jsParser } from './javascript'
import { tsParser } from './typescript'

export const docgen = async (files: string[], config: Config) => {
  const cwd = paths.getRootDir(config)
  const tsconfig = await findUp('tsconfig.json', { cwd })
  return config.typescript
    ? tsParser(files, config, tsconfig)
    : jsParser(files, config)
}
