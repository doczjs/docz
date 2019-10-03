import findUp from 'find-up'

import * as paths from '../../config/paths'
import { Config } from '../../config/argv'
import { jsParser } from './javascript'
import { tsParser } from './typescript'
import { normalize } from 'path'

export const unixPath = (src: string): string => {
  return normalize(src).replace(/\\/g, '/')
}

export const docgen = async (files: string[], config: Config) => {
  const cwd = paths.getRootDir(config)
  const tsconfig = await findUp('tsconfig.json', { cwd })
  const tsFiles = files.filter(file => file.match(/\.(tsx|ts)$/))
  const jsFiles = files.filter(file => file.match(/\.(js|jsx|mjs)$/))

  return config.typescript
    ? tsParser(tsFiles, config, tsconfig).concat(jsParser(jsFiles, config))
    : jsParser(jsFiles, config)
}
