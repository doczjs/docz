import fs from 'fs'
import path from 'path'
import glob from 'fast-glob'
import { parse } from 'babylon'
import { NodePath } from 'babel-traverse'
import * as t from 'babel-types'

import { traverseAndAssign } from './traverse'

export interface IComponent {
  readonly id: string
  readonly route: string
  readonly filepath: string
}

export interface IComponentMap {
  readonly [key: string]: IComponent
}

const ROOT_PATH = fs.realpathSync(process.cwd())

const convertToAst = (entry: string): t.File =>
  parse(fs.readFileSync(entry, 'utf-8'), {
    sourceType: 'module',
    plugins: ['jsx'],
  })

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

const getNameFromDoc = traverseAndAssign<any, string>(
  path => path.isCallExpression() && path.node.callee.name === 'doc',
  path => path.node.arguments[0].value
)

const reduceByName = (obj: any, entry: string): IComponentMap => {
  const ast = convertToAst(entry)
  const name = getNameFromDoc(ast)
  const route = path.join('/', path.parse(entry).dir, name || '')
  const filepath = path.join(ROOT_PATH, entry)

  return Object.assign({}, obj, {
    [`${name}`]: {
      filepath,
      route,
    },
  })
}

export const componentsFromPattern = (pattern: string): IComponentMap => {
  const ignoreGlob = '!node_modules'
  const entries: string[] = glob.sync(
    Array.isArray(pattern) ? [...pattern, ignoreGlob] : [pattern, ignoreGlob]
  )

  return entries.filter(isPlaygroddFile).reduce(reduceByName, {})
}
