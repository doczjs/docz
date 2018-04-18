export const isFn = (value: any): boolean => typeof value === 'function'

export const safeUrl = (value: string) => encodeURI(value.replace(/\s/g, ''))
