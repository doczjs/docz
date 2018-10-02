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

  do {
    m = regex.exec(code)
    if (m) {
      const [, imp] = m
      imports.push(imp)
    }
  } while (m)

  return imports
}

interface AliasConfig {
  [alias: string]: string
}

/**
 * See https://github.com/Microsoft/TypeScript/blob/9c71eaf59040ae75343da8cdff01344020f5bba2/src/compiler/moduleNameResolver.ts#L544
 */
const resolveAliases = (module: string, aliases: AliasConfig): string => {
  return Object.keys(aliases).reduce<string>((module, alias) => {
    const matcher = new RegExp(`^${alias.slice().replace(/\*/, '(.*)')}$`)
    const m = matcher.exec(module)
    if (!m) {
      return module
    }

    const path = aliases[alias]

    const [, sub] = m
    return path.slice().replace(/\*/, sub)
  }, module)
}

const resolveModule = (module: string, relativePath: string): string | null => {
  module = resolveAliases(module, {}) // TODO: Read tsconfig.json and pass paths here
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
  const reducer = async (paths: Promise<string[]>, filepath: string) => {
    return findSourceFiles(config, filepath, await paths)
  }

  const isFirstVisit = (imp: string) => found.indexOf(imp) === -1
  const isPathResolved = (path: string | null): path is string => path !== null

  return imports
    .filter(isFirstVisit)
    .map(_ => resolveModule(_, relativePath))
    .filter(isPathResolved)
    .reduce(reducer, initial)
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
