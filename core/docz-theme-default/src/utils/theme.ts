import { get } from 'lodash/fp'

export const themeProp = (str: string) => (props: any) => {
  return get(`theme.${str}`, props)
}
