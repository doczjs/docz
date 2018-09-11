// @ts-ignore
import parser from 'jsdoc3-parser'
import glob from 'fast-glob'
import * as path from 'path'
import { Config } from '../commands/args'
import * as paths from '../config/paths'

interface ASTMeta {
  range: number[]
  lineno: number
  columnno: number
  path: string
  code: any
}

interface ASTParam {
  name: string
  type?: {
    names: string[]
  }
  optional?: boolean
  defaultValue?: any
  description?: string
}


interface ASTReturns {
  name: string
  type?: {
    names: string[]
  }
  description?: string
}

interface ASTNode {
  name: string
  description?: string
  comment?: string
  meta?: ASTMeta
  undocumented?: boolean
  params?: ASTParam[]
  returns?: ASTReturns
  longname: string
  kind: string
  memberof?: string
  scope?: string
}

export type JSDocAST = ASTNode[]

async function findSourceFiles(config: Config): Promise<string[]> {
  const src = path.resolve(paths.root, config.src)

  return glob<string>(`${src}/**/*.(js|ts|jsx|tsx)`, {
    onlyFiles: true,
    unique: true,
    nocase: true,
    matchBase: true,
  })
}

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