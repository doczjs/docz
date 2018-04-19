import { loadFileSync } from 'babel-file-loader'

export type AssignFn<P, V> = (path: P) => V
export type WhenFn<P> = (path: P) => boolean

export type TraverseReturn<V> = (filepath: string) => V | null

export interface TraverseAndAssign<P, V> {
  assign: AssignFn<P, V>
  when: WhenFn<P>
}

export function traverseAndAssign<P = any, V = any>({
  assign,
  when,
}: TraverseAndAssign<P, V>): TraverseReturn<V> {
  return filepath => {
    // tslint:disable
    let value = null

    try {
      const file = loadFileSync(filepath)

      file.path.traverse({
        enter(path: any) {
          if (when(path)) {
            value = assign(path)
            path.stop()
          }
        },
      })
    } finally {
      return value
    }
  }
}

export interface TraverseAndAssignEach<P, V> {
  assign: AssignFn<P, V>
  when: string
}

export function traverseAndAssignEach<P = any, V = any>({
  assign,
  when,
}: TraverseAndAssignEach<P, V>): TraverseReturn<V> {
  return filepath => {
    // tslint:disable
    let value: any = []

    try {
      const file = loadFileSync(filepath)

      file.path.traverse({
        [when](path: any) {
          const result = assign(path)
          result && value.push(result)
        },
      })
    } finally {
      return value
    }
  }
}
