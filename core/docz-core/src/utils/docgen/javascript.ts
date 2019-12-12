import * as fs from 'fs-extra'
import * as path from 'path'
import logger from 'signale'
import actualNameHandler from 'react-docgen-actual-name-handler'
import * as reactDocgen from 'react-docgen'

import { Config } from '../../config/argv'
import { getRootDir } from '../../config/paths'
import { unixPath } from '.'
import { resolver as doczResolver } from './docz-docgen-resolver'
import externalProptypesHandler from './externalProptypesHandler'

const throwError = (err: any) => {
  logger.fatal(`Error parsing static types`)
  logger.error(err)
}

export const jsParser = (files: string[], config: Config) => {
  const resolver = config.docgenConfig.resolver || doczResolver

  const root = getRootDir(config)
  const parseFilepathProps = (filepath: string) => {
    const fullpath = path.resolve(root, filepath)
    const handlers = reactDocgen.defaultHandlers.concat([
      externalProptypesHandler(filepath),
      actualNameHandler,
    ])

    try {
      const code = fs.readFileSync(fullpath, { encoding: 'utf-8' })
      const props = reactDocgen.parse(code, resolver, handlers)
      return { key: unixPath(filepath), value: props }
    } catch (err) {
      if (config.debug) throwError(err)
      return null
    }
  }

  return files.map(parseFilepathProps).filter(Boolean)
}
