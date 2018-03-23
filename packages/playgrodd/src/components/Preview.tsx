import * as React from 'react'
import { Subscribe } from 'unstated'

import { DocumentsContainer } from '../container'
import { IDoc } from '../documents'

export const Preview: React.SFC = () => (
  <Subscribe to={[DocumentsContainer]}>
    {({ state }) => {
      const documents: IDoc[] = Object.values(state.documents)
      return documents.length > 0 && documents.map(doc => doc.getName())
    }}
  </Subscribe>
)
