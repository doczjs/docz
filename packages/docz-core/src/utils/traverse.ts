import traverse from 'babel-traverse'
import { File } from 'babel-types'

export type WhenFn<P> = (path: P) => boolean
export type AssignFn<P, V> = (path: P) => V

export interface TraverseParams<P, V> {
  assign: AssignFn<P, V>
  when: WhenFn<P>
}
export type TraverseReturn<V> = (ast: File) => V | undefined

export function traverseAndAssign<P = any, V = any>({
  assign,
  when,
}: TraverseParams<P, V>): TraverseReturn<V> {
  return ast => {
    // tslint:disable-next-line
    let value

    traverse(ast, {
      enter(path: any): void {
        if (when(path)) {
          value = assign(path)
          return
        }
      },
    })

    return value
  }
}
