// @ts-ignore
import parser from 'jsdoc3-parser'
import glob from 'fast-glob'
import * as path from 'path'
import { Config } from '../commands/args'
import * as paths from '../config/paths'
import { Entries } from '../Entries'
import fs from 'fs'
import cp from 'child_process'

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

function findImports(code: string): RegExpMatchArray {
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

<<<<<<< HEAD
export async function parseSourceFiles(config: Config): Promise<JSDocAST>  {
  const files = await findSourceFiles(config)

  const promises = files.map(async (file) => {
    return new Promise<JSDocAST>((resolve, reject) => {
      return parser(file, (error: string | null, ast: JSDocAST) => resolve(ast))
    })
  })

  const asts = await Promise.all(promises)
  return asts.reduce((acc, ast) => acc.concat(ast), [])
}
=======
function resolveModule(module: string, relativePath: string): string | null {
  const lookups = [
    `${module}.js`,
    `${module}.jsx`,
    `${module}.mjs`,
    `${module}.ts`,
    `${module}.tsx`,
    `${module}/index.js`,
    `${module}/index.ts`,
    `${module}/index.jsx`,
    `${module}/index.tsx`,
    `${module}/index.mjs`,
  ]
  const def = lookups.find(lookup => {
    const filepath = path.resolve(relativePath, lookup)
    return fs.existsSync(filepath)
  })
  if (def) {
    return path.resolve(relativePath, def)
  }
  return null
}

async function findSourceFiles(
  config: Config,
  filepath: string,
  found: string[]
): Promise<string[]> {
  const relativePath = path.dirname(filepath)
  const code = await new Promise<string>((resolve, reject) => {
    return fs.readFile(filepath, (err, code) => {
      if (err) return reject(err)
      resolve(code.toString())
    })
  })

  const imports = findImports(code)
  return imports.reduce<Promise<string[]>>(async (paths, imp) => {
    const filepath = resolveModule(imp, relativePath)
    if (filepath) {
      return findSourceFiles(config, filepath, await paths)
    }
    return paths
  }, Promise.resolve(found.concat(filepath)))
}

export async function parseSourceFiles(
  entries: Entries,
  config: Config
): Promise<AnnotationsMap> {
  const src = path.resolve(paths.root, config.src)
  const entriesPaths = Object.keys(await entries.get())
  const filepaths = await entriesPaths.reduce<Promise<string[]>>(
    async (paths, entry) => {
      const filepath = path.resolve(src, entry)
      return findSourceFiles(config, filepath, await paths)
    },
    Promise.resolve([])
  )

  console.log(filepaths)

  return filepaths.reduce(
    (acc, filename) => {
      try {
        acc[filename] = JSON.parse(
          cp.execSync(`jsdoc -X ${filename}`).toString()
        ) as NodeAST[]
        return acc
      } catch (e) {
        return acc
      }
    },
    {} as AnnotationsMap
  )
}
>>>>>>> chore: use recursive module resolution to discover files
