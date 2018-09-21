import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import strip from 'strip-indent'
import { getProp, getPropValue } from 'jsx-ast-utils'

type Condition = (path: any) => boolean
type Predicate = (path: any) => any

export const valueFromTraverse = (
  condition: Condition,
  predicate: Predicate = p => p
) => (code: string) => {
  let value = ''
  const ast = parser.parse(code, { plugins: ['jsx'] })

  traverse(ast, {
    enter(path: any): void {
      if (condition(path)) {
        value = predicate(path)
        path.stop()
        return
      }
    },
  })

  return value
}

const codeFromNode = (condition: Condition) => (code: string) =>
  valueFromTraverse(condition, p => code.slice(p.node.start, p.node.end))(code)

export const propFromElement = (prop: string) =>
  valueFromTraverse(
    p => p.isJSXOpeningElement(),
    p => getPropValue(getProp(p.node.attributes, prop))
  )

export const removeTags = (code: string) => {
  const open = codeFromNode(p => p.isJSXOpeningElement())
  const close = codeFromNode(p => p.isJSXClosingElement())

  return code.replace(open(code), '').replace(close(code), '')
}

export const sanitizeCode = (code: string) =>
  strip(code)
    .trim()
    .replace(/'/g, `\\'`)
    .replace(/`/g, '\\`')
