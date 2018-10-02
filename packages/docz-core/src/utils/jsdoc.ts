// @ts-ignore
import * as fs from 'fs-extra'
import * as path from 'path'
import { shellSync } from 'execa'

import * as paths from '../config/paths'
import { Config } from '../commands/args'
import { Entries } from '../Entries'
import { read } from '../utils/fs'

interface MetaAST {
  range: number[]
  lineno: number
  columnno: number
  path: string
  code: any
}

interface ParamAST {
  name: string
  type?: {
    names: string[]
  }
  optional?: boolean
  defaultValue?: any
  description?: string
}

interface ReturnAST {
  name: string
  type?: {
    names: string[]
  }
  description?: string
}

interface NodeAST {
  name: string
  description?: string
  comment?: string
  meta?: MetaAST
  undocumented?: boolean
  params?: ParamAST[]
  returns?: ReturnAST[]
  longname: string
  kind: string
  memberof?: string
  scope?: string
}

export interface AnnotationsMap {
  [path: string]: NodeAST[]
}

const findImports = (code: string): RegExpMatchArray => {
  const regex = /\s*from\s*["']\s*([.@\w/_-]+)\s*["'][\s*;?]?$/gm

  const imports: string[] = []
  let m

  while (true) {
    m = regex.exec(code)
    if (m === null) break
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }

    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      if (groupIndex > 0) imports.push(match)
    })
  }

  return imports
}

const resolveModule = (module: string, relativePath: string): string | null => {
  const lookups = [
    `${module}.js`,
    `${module}.ts`,
    `${module}.jsx`,
    `${module}.mjs`,
    `${module}.tsx`,
    `${module}/index.js`,
    `${module}/index.ts`,
    `${module}/index.jsx`,
    `${module}/index.tsx`,
    `${module}/index.mjs`,
  ]

  const def = lookups.find(lookup => {
    const filepath = path.resolve(relativePath, lookup)
    return fs.pathExistsSync(filepath)
  })

  return def ? path.resolve(relativePath, def) : null
}

const findSourceFiles = async (
  config: Config,
  filepath: string,
  found: string[]
): Promise<string[]> => {
  const code = await read(filepath)
  const imports = findImports(code)
  const relativePath = path.dirname(filepath)
  const initial = Promise.resolve(found.concat(filepath))
  const reducer = async (paths: Promise<string[]>, imp: string) => {
    const filepath = resolveModule(imp, relativePath)
    return filepath ? findSourceFiles(config, filepath, await paths) : paths
  }

  return imports.reduce(reducer, initial)
}

const pathsFromEntries = (config: Config, src: string, filespaths: string[]) =>
  filespaths.reduce(async (paths: Promise<string[]>, entry: string) => {
    const filepath = path.resolve(src, entry)
    return findSourceFiles(config, filepath, await paths)
  }, Promise.resolve([]))

export const jsdocParse = (filepath: string) => {
  try {
    const { stdout } = shellSync(`jsdoc -X ${filepath}`)
    return JSON.parse(stdout)
  } catch (e) {
    return null
  }
}

export const parseSourceFiles = async (
  entries: Entries,
  config: Config
): Promise<AnnotationsMap> => {
  const src = path.resolve(paths.root, config.src)
  const entriesPaths = Object.keys(await entries.get())
  const filepaths = await pathsFromEntries(config, src, entriesPaths)

  const reducer = (acc: AnnotationsMap, filepath: string) => {
    const parsed = jsdocParse(filepath)
    return parsed ? { ...acc, [filepath]: parsed } : acc
  }

  return filepaths.reduce(reducer, {})
}
