import * as path from 'path'
import * as t from 'babel-types'
import { ulid } from 'ulid'
import { NodePath } from 'babel-traverse'
import generate from 'babel-generator'
import get from 'lodash.get'

import * as paths from './config/paths'
import { format } from './utils/format'
import { traverseAndAssign, traverseAndAssignEach } from './utils/traverse'

const hasImport = (p: NodePath<any>): boolean =>
  t.isImportDeclaration(p) && get(p, 'node.source.value') === `docz`

const hasDocFn = (p: NodePath<any>): boolean =>
  p.node.specifiers &&
  p.node.specifiers.some(
    (node: NodePath<any>) =>
      t.isImportSpecifier(node) && node.imported.name === 'doc'
  )

const checkImport = traverseAndAssign<NodePath<t.Node>, boolean>({
  when: p => hasImport(p) && hasDocFn(p),
  assign: () => true,
})

const getNameFromDoc = traverseAndAssign<any, string>({
  when: p => p.isCallExpression() && get(p, 'node.callee.name') === 'doc',
  assign: p => get(p, 'node.arguments[0].value'),
})

const parseSections = traverseAndAssignEach<NodePath<t.Node>, string[]>({
  when: 'MemberExpression',
  assign: p => {
    const name = get(p, 'node.property.name')
    const args = get(p, 'parentPath.node.arguments')

    if (name === 'section' && args && args.length > 0) {
      for (const arg of args) {
        if (arg.type !== 'StringLiteral') {
          const { code } = generate(arg.body)
          return format(code).slice(1, Infinity) as any
        }
      }
    }
  },
})

export class Entry {
  readonly [key: string]: any

  public static check(file: string): boolean | null {
    return checkImport(file)
  }

  public static parseName(file: string): string | null {
    return getNameFromDoc(file)
  }

  public static parseSections(file: string): string[] | null {
    const sections = parseSections(file)
    return sections && sections.reverse()
  }

  public id: string
  public filepath: string
  public name: string | null
  public sections: string[] | null

  constructor(file: string, src: string) {
    const filepath = path.relative(paths.root, file)

    this.id = ulid()
    this.filepath = filepath
    this.name = Entry.parseName(file)
    this.sections = Entry.parseSections(file)
  }
}
