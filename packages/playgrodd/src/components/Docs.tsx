import * as React from 'react'
import { SFC } from 'react'
import { Subscribe } from 'unstated'
import { DocsProps } from 'playgrodd'

import { DocsContainer } from '../container'

export const Docs: SFC<DocsProps> = ({ children }) => (
  <Subscribe to={[DocsContainer]}>
    {({ state }) => children(Object.values(state.docs))}
  </Subscribe>
)
