import fs from 'fs'
import path from 'path'
import glob from 'fast-glob'
import { parse } from 'babylon'
import { NodePath } from 'babel-traverse'
import * as t from 'babel-types'

import { traverseAndAssign } from '../utils/traverse'

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

export interface IEntryObj {
  name: string
  filepath: string
  route: string
}

const mountEntriesMapper = (file: string): IEntryObj => {
  const ast = convertToAst(file)
  const name = getNameFromDoc(ast) || ''
  const route = path.join('/', path.parse(file).dir, name)
  const filepath = path.relative(ROOT_PATH, file)

  return {
    name,
    route,
    filepath,
  }
}

export const entriesMapper = (pattern: string): IEntryObj[] => {
  const ignoreGlob = '!node_modules'
  const files: string[] = glob.sync(
    Array.isArray(pattern) ? [...pattern, ignoreGlob] : [pattern, ignoreGlob]
  )

  return files.filter(isPlaygroddFile).map(mountEntriesMapper)
}
