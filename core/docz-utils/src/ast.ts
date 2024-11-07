import * as parser from '@babel/parser'
import traverse from '@babel/traverse'

type Condition = (path: any) => boolean
type Predicate<Value> = (path: any) => Value

export const valueFromTraverse =
  <Value = any>(condition: Condition, predicate: Predicate<Value> = p => p) =>
  (code: string): Value | '' => {
    let value: Value | '' = ''
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
