import { ComponentType } from 'react'
import * as React from 'react'

import { Entry } from '../'
import { entriesContext } from './Docs'

interface ThemeProps {
  entries: Entry[]
}

type Theme = (WC: ComponentType) => ComponentType<ThemeProps>

export const theme: Theme = WrappedComponent => ({ entries }) => (
  <entriesContext.Provider value={entries}>
    <WrappedComponent />
  </entriesContext.Provider>
)
