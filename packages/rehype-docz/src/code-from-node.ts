import * as babylon from 'babylon'
import traverse from 'babel-traverse'

type Condition = (path: any) => boolean

export const codeFromNode = (condition: Condition) => (code: string) => {
  let value = ''
  const ast = babylon.parse(code, { plugins: ['jsx'] })

  traverse(ast, {
    enter(path: any): void {
      if (condition(path)) {
        value = code.slice(path.node.start, path.node.end)
        path.stop()
        return
      }
    },
  })

  return value
}
