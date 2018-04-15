import * as glob from 'fast-glob'
import * as t from 'babel-types'
import { NodePath } from 'babel-traverse'

import { traverseAndAssign } from './utils/traverse'
import { Entry, convertToAst } from './Entry'

const hasImport = (path: NodePath<any>): boolean =>
  path.isImportDeclaration() &&
  path.node &&
  path.node.source &&
  path.node.source.value === 'docz'

const hasDocFn = (path: NodePath<any>): boolean =>
  path.node.specifiers &&
  path.node.specifiers.some(
    (node: NodePath<any>) =>
      t.isImportSpecifier(node) && node.imported.name === 'doc'
  )

const checkImport = traverseAndAssign<NodePath<t.Node>, boolean>(
  path => hasImport(path) && hasDocFn(path),
  path => true
)

const isFile = (entry: string) => checkImport(convertToAst(entry))

export class Entries {
  private files: string[]

  constructor(pattern: string) {
    const ignoreGlob = '!node_modules'

    this.files = glob.sync(
      Array.isArray(pattern) ? [...pattern, ignoreGlob] : [pattern, ignoreGlob]
    )
  }

  public parse(src: string): Entry[] {
    return this.files.filter(isFile).map(file => new Entry({ file, src }))
  }
}
