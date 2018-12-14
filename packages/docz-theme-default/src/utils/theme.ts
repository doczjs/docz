import getter from 'lodash.get'

export const get = (val: string, defaultValue?: any) => (p: any) =>
  getter(p, `theme.docz.${val}`, defaultValue)
