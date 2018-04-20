import * as React from 'react'
import { ComponentType } from 'react'
import { Entry } from 'docz/doc'

import { entriesContext } from './Docs'

export interface ThemeProps {
  entries: Entry[]
}

export type Theme = (WC: ComponentType) => ComponentType<ThemeProps>

export const theme: Theme = WrappedComponent => ({ entries }) => (
  <entriesContext.Provider value={entries}>
    <WrappedComponent />
  </entriesContext.Provider>
)
