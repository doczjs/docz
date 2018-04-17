import * as React from 'react'
import { SFC } from 'react'
import { Subscribe } from 'unstated'

import { Doc, DocsProps } from '../../'
import { DocsContainer } from '../DocsContainer'

const sortByOrder = (a: Doc, b: Doc) => b.docOrder - a.docOrder

export const Docs: SFC<DocsProps> = ({ children }) => (
  <Subscribe to={[DocsContainer]}>
    {({ state }) => children(state.docs.sort(sortByOrder))}
  </Subscribe>
)
