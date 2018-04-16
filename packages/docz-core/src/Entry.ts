import * as fs from 'fs'
import * as path from 'path'
import { File } from 'babel-types'
import { parse } from 'babylon'

import * as paths from './config/paths'
import { traverseAndAssign } from './utils/traverse'

export const convertToAst = (entry: string): File =>
  parse(fs.readFileSync(entry, 'utf-8'), {
    sourceType: 'module',
    plugins: ['jsx'],
  })

const getNameFromDoc = traverseAndAssign<any, string>(
  path => path.isCallExpression() && path.node.callee.name === 'doc',
  path => path.node.arguments[0].value
)

export interface IEntryConstructor {
  file: string
  src: string
}

export class Entry {
  public name: string
  public filepath: string

  constructor({ src, file }: IEntryConstructor) {
    const ast = convertToAst(file)
    const name = getNameFromDoc(ast) || ''
    const filepath = path.relative(paths.root, file)

    this.name = name
    this.filepath = filepath
  }

  static parseName(file: string) {
    const ast = convertToAst(file)
    return getNameFromDoc(ast)
  }
}
