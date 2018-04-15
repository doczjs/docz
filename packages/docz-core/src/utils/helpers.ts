const { keys } = Object

export const isFn = (value: any): boolean => typeof value === 'function'
export const prop = (key: string, obj: any): any => obj[key]

export function omit<R = object>(props: string[], obj: any): R {
  const newObj = keys(obj)
    .filter((key: string): boolean => props.indexOf(key) === -1)
    .reduce(
      (returnObj: any, key: string): R => ({ ...returnObj, [key]: obj[key] }),
      {}
    )

  return newObj as R
}

export function pick<R = object>(props: string[], obj: any): R {
  const newObj = keys(obj)
    .filter((key: string): boolean => props.indexOf(key) > -1)
    .reduce(
      (returnObj: any, key: string): R => ({ ...returnObj, [key]: obj[key] }),
      {}
    )

  return newObj as R
}
