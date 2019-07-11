import { useContext } from 'react'
import { get } from 'lodash/fp'

import { doczState } from '../state'

export const useCurrentDoc = () => {
  if (typeof window === 'undefined') return null
  const state = useContext(doczState.context)
  return get('currentEntry.value', state)
}
