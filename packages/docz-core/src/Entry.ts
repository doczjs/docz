import * as fs from 'fs'
import * as path from 'path'
import { File } from 'babel-types'
import { parse } from 'babylon'

import * as paths from './config/paths'
import { traverseAndAssign } from './utils/traverse'

export const convertToAst = (entry: string): File =>
  parse(fs.readFileSync(entry, 'utf-8'), {
    plugins: ['jsx'],
    sourceType: 'module',
  })

const getNameFromDoc = traverseAndAssign<any, string>({
  assign: p => p.node.arguments[0].value,
  when: p => p.isCallExpression() && p.node.callee.name === 'doc',
})

export interface EntryConstructor {
  file: string
  src: string
}

export class Entry {
  public static parseName(file: string): string | undefined {
    const ast = convertToAst(file)
    return getNameFromDoc(ast)
  }

  public name: string
  public filepath: string

  constructor({ src, file }: EntryConstructor) {
    const ast = convertToAst(file)
    const name = getNameFromDoc(ast) || ''
    const filepath = path.relative(paths.root, file)

    this.name = name
    this.filepath = filepath
  }
}
