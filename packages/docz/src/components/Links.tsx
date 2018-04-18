import * as React from 'react'
import { SFC } from 'react'
import { Subscribe } from 'unstated'

import { LinksProps } from '../../'
import { DocsContainer } from '../DocsContainer'
import { isFn } from '../utils/helpers'

export const Links: SFC<LinksProps> = ({ children }) => (
  <Subscribe to={[DocsContainer]}>
    {(container: DocsContainer) =>
      isFn(children) && children(container.links())
    }
  </Subscribe>
)
