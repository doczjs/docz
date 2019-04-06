import * as fs from 'fs-extra'
import logger from 'signale'
import externalProptypesHandler from 'react-docgen-external-proptypes-handler'
import actualNameHandler from 'react-docgen-actual-name-handler'
import reactDocgen from 'react-docgen'

import { Config } from '../../config/argv'

const throwError = (err: any) => {
  logger.fatal(`Error parsing static types`)
  logger.error(err)
}

export const jsParser = (files: string[], config: Config) => {
  const resolver =
    config.docgenConfig.resolver ||
    reactDocgen.resolver.findAllExportedComponentDefinitions

  const parseFilepathProps = (filepath: string) => {
    const handlers = reactDocgen.defaultHandlers.concat([
      externalProptypesHandler(filepath),
      actualNameHandler,
    ])

    try {
      const code = fs.readFileSync(filepath, 'utf-8')
      const props = reactDocgen.parse(code, resolver, handlers)
      return { key: filepath, value: props }
    } catch (err) {
      if (config.debug) throwError(err)
      return null
    }
  }

  return files.map(parseFilepathProps).filter(Boolean)
}
