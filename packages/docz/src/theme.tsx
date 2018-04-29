import * as React from 'react'
import { ComponentType } from 'react'

import { entriesContext } from './Docs'

export interface ThemeProps {
  entries: any[]
}

export type Theme = (WC: ComponentType) => ComponentType<ThemeProps>

export const theme: Theme = WrappedComponent => ({ entries }) => (
  <entriesContext.Provider value={entries}>
    <WrappedComponent />
  </entriesContext.Provider>
)
