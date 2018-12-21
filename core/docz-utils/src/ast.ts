import * as parser from '@babel/parser'
import traverse from '@babel/traverse'

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

export const codeFromNode = (condition: Condition) => (code: string) =>
  valueFromTraverse(condition, p => code.slice(p.node.start, p.node.end))(code)
