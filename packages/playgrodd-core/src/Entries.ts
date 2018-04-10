import * as glob from 'fast-glob'
import * as t from 'babel-types'
import { NodePath } from 'babel-traverse'

import { traverseAndAssign } from './utils/traverse'
import { Entry, convertToAst } from './Entry'

const hasPlaygroddImported = (path: NodePath<any>): boolean =>
  path.isImportDeclaration() &&
  path.node &&
  path.node.source &&
  path.node.source.value === 'playgrodd'

const hasDocFn = (path: NodePath<any>): boolean =>
  path.node.specifiers &&
  path.node.specifiers.some(
    (node: NodePath<any>) =>
      t.isImportSpecifier(node) && node.imported.name === 'doc'
  )

const checkIfImportPlaygrodd = traverseAndAssign<NodePath<t.Node>, boolean>(
  path => hasPlaygroddImported(path) && hasDocFn(path),
  path => true
)

const isPlaygroddFile = (entry: string) =>
  checkIfImportPlaygrodd(convertToAst(entry))

export class Entries {
  private files: string[]

  constructor(pattern: string) {
    const ignoreGlob = '!node_modules'

    this.files = glob.sync(
      Array.isArray(pattern) ? [...pattern, ignoreGlob] : [pattern, ignoreGlob]
    )
  }

  public parse(): Entry[] {
    return this.files.filter(isPlaygroddFile).map(file => new Entry(file))
  }
}
