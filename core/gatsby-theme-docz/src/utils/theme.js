import { get } from 'lodash/fp'

export const themeProp = str => props => {
  return get(`theme.${str}`, props)
}
