import * as path from 'path'
import * as fs from 'fs-extra'
import { isFunction } from 'lodash/fp'
import logger from 'signale'
import findUp from 'find-up'
import externalProptypesHandler from 'react-docgen-external-proptypes-handler'
// import importedProptypesHandler from 'react-docgen-imported-proptype-handler'
import actualNameHandler from 'react-docgen-actual-name-handler'
import reactDocgenTs from 'react-docgen-typescript'
import reactDocgen from 'react-docgen'
import PrettyError from 'pretty-error'

import * as paths from '../config/paths'
import { Config } from '../config/argv'

const pe = new PrettyError()
const fileFullPath = (filepath: string) => path.join(paths.root, filepath)

const tsParser = async (files: string[], config: Config) => {
  const tsConfigPath = await findUp('tsconfig.json', { cwd: paths.root })
  if (!tsConfigPath) return {}

  try {
    const { parse } = reactDocgenTs.withCustomConfig(tsConfigPath, {
      propFilter(prop: any, component: any): any {
        if (prop.parent == null) return true
        const propFilter = config.docgenConfig.propFilter
        const val = propFilter && isFunction(propFilter) && propFilter(prop)
        return !prop.parent.fileName.includes('node_modules') || Boolean(val)
      },
    })

    return files
      .map(filepath => ({ [fileFullPath(filepath)]: parse(filepath) }))
      .reduce((obj, val) => ({ ...obj, ...val }), {})
  } catch (err) {
    logger.fatal('Error parsing static types.')
    pe.render(err)
    return {}
  }
}

const jsParser = (files: string[], config: Config) => {
  const resolver =
    config.docgenConfig.resolver ||
    reactDocgen.resolver.findAllExportedComponentDefinitions

  return files.reduce((memo: any, filepath) => {
    const handlers = reactDocgen.defaultHandlers.concat([
      externalProptypesHandler(filepath),
      // importedProptypesHandler(filepath),
      actualNameHandler,
    ])

    const code = fs.readFileSync(filepath, 'utf-8')

    try {
      const data = reactDocgen.parse(code, resolver, handlers)
      memo[fileFullPath(filepath)] = data
    } catch (err) {
      pe.render(err)
    }

    return memo
  }, {})
}

export const docgen = async (files: string[], config: Config) =>
  config.typescript ? tsParser(files, config) : jsParser(files, config)
