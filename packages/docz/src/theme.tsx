import * as React from 'react'
import { ComponentType } from 'react'

import { docsContext } from './Docs'

export interface ThemeProps {
  docs: any[]
}

export type Theme = (WC: ComponentType) => ComponentType<ThemeProps>

export const theme: Theme = WrappedComponent => ({ docs }) => (
  <docsContext.Provider value={docs}>
    <WrappedComponent />
  </docsContext.Provider>
)
