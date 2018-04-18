import * as React from 'react'
import { SFC } from 'react'
import { Subscribe } from 'unstated'

import { DocsProps } from '../../'
import { DocsContainer } from '../DocsContainer'
import { isFn } from '../utils/helpers'

export const Docs: SFC<DocsProps> = ({ children }) => (
  <Subscribe to={[DocsContainer]}>
    {(container: DocsContainer) => isFn(children) && children(container.docs())}
  </Subscribe>
)
