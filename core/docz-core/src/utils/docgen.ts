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
import ts from 'typescript'

import * as paths from '../config/paths'
import { Config } from '../config/argv'

const fileFullPath = (filepath: string) => path.join(paths.root, filepath)

const throwError = (err: any) => {
  logger.fatal(`Error parsing static types`)
  logger.error(err)
}

const tsProgram = (files: string[]) =>
  ts.createProgram(files, {
    jsx: ts.JsxEmit.React,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.Latest,
  })

const tsDocgen = (config: Config, tsconfig: string, program: ts.Program) => (
  filepath: string
) =>
  new Promise((resolve, reject) => {
    try {
      const opts = {
        propFilter(prop: any): any {
          if (prop.parent == null) return true
          const propFilter = config.docgenConfig.propFilter
          const val = propFilter && isFunction(propFilter) && propFilter(prop)
          return !prop.parent.fileName.includes('node_modules') || Boolean(val)
        },
      }

      const docs = reactDocgenTs
        .withCustomConfig(tsconfig, opts)
        .parseWithProgramProvider(filepath, () => program)

      resolve(docs)
    } catch (err) {
      reject(err)
    }
  })

const tsParser = async (files: string[], config: Config) => {
  const tsConfigPath = await findUp('tsconfig.json', { cwd: paths.root })
  if (!tsConfigPath) return {}
  const program = tsProgram(files)
  const parse = tsDocgen(config, tsConfigPath, program)
  try {
    const operations = await Promise.all(
      files.map(async filepath => ({
        [fileFullPath(filepath)]: await parse(filepath),
      }))
    )

    return operations.reduce((obj, val) => ({ ...obj, ...val }), {})
  } catch (err) {
    if (config.debug) throwError(err)
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
      if (config.debug) throwError(err)
    }

    return memo
  }, {})
}

export const docgen = async (files: string[], config: Config) => {
  config.typescript ? tsParser(files, config) : jsParser(files, config)
}
