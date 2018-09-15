import { get, differenceBy } from 'lodash/fp'
import merge from 'deepmerge'

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

export function mergeArrOfObject<T>(a: T[], b: T[], prop: string): T[] {
  const values = a.reduce((arr: any[], item: any) => {
    const idx = b.findIndex(i => get(prop, i) === get(prop, item))
    return idx !== -1 ? arr.concat([merge(item, b[idx])]) : arr.concat([item])
  }, [])

  return values.concat(differenceBy(prop, b, a))
}
