import * as React from 'react'
import { ComponentType } from 'react'

import { docsContext } from './Docs'
import { DocObj } from './Doc'

export type DocsMap = Record<string, DocObj>

export interface ThemeProps {
  docs: DocsMap
}

export type Theme = (WC: ComponentType) => ComponentType<ThemeProps>

export const theme: Theme = WrappedComponent => ({ docs }) => (
  <docsContext.Provider value={docs}>
    <WrappedComponent />
  </docsContext.Provider>
)
