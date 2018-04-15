import traverse from 'babel-traverse'
import { File } from 'babel-types'

export interface IWhenFn<P> {
  (path: P): boolean
}

export interface IAssignFn<P, V> {
  (path: P): V
}

export function traverseAndAssign<P = any, V = any>(
  when: IWhenFn<P>,
  assign: IAssignFn<P, V>
) {
  return (ast: File): V | undefined => {
    let value

    traverse(ast, {
      enter(path: any) {
        if (when(path)) {
          value = assign(path)
          return
        }
      },
    })

    return value
  }
}
