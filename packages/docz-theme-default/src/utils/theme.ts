import getter from 'lodash.get'

export const get = (val: string) => (p: any) => getter(p, `theme.docz.${val}`)
