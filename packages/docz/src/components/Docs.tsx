import * as React from 'react'
import { SFC } from 'react'
import { Subscribe } from 'unstated'

import { Doc, DocObj, DocsProps } from '../../'
import { DocsContainer } from '../DocsContainer'
import { isFn } from '../utils/helpers'

const sortByOrder = (a: DocObj, b: DocObj) => b.order - a.order

export const Docs: SFC<DocsProps> = ({ children }) => (
  <Subscribe to={[DocsContainer]}>
    {({ state }) => {
      const docs: Doc[] = Array.from(state.docs.values())
      const docsObj: DocObj[] = docs.map(doc => doc.toObject())
      const sortedDocs: DocObj[] = docsObj.sort(sortByOrder)

      return isFn(children) && children(sortedDocs)
    }}
  </Subscribe>
)
