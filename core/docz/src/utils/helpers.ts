import { get, unionBy } from 'lodash/fp'

export const isFn = (value: any): boolean => typeof value === 'function'

export function flatArrFromObject<T>(arr: T[], prop: string): string[] {
  const reducer = (arr: string[], obj: T): string[] => {
    const value = get(prop)(obj)
    return value ? arr.concat([value]) : arr
  }

  return Array.from(new Set(arr.reduce(reducer, [])))
}

export function compare<T>(a: T, b: T, reverse?: boolean): number {
  if (a < b) return reverse ? 1 : -1
  if (a > b) return reverse ? -1 : 1
  return 0
}

export function mergeArrBy<T>(prop: string, a: T[], b: T[]): T[] {
  return unionBy<T>(prop, a)(b)
}
