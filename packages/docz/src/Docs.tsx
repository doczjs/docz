import * as React from 'react'

import { Doc, DocObj } from './Doc'
import { DocMap } from './theme'

export const isFn = (value: any): boolean => typeof value === 'function'
export const docsContext = React.createContext({} as DocMap)

const sortDocs = (docs: DocObj[]) =>
  docs.sort((docA, docB) => docB.order - docA.order)

export interface DocsRenderProps {
  docs: DocObj[]
  categories: string[]
}

export interface DocsProps {
  children: (renderProps: DocsRenderProps) => React.ReactNode
}

export const Docs: React.SFC<DocsProps> = ({ children }) => (
  <docsContext.Consumer>
    {docs => {
      if (!isFn(children)) {
        throw new Error(
          'You need to pass a children as a function to your <Docs/> component'
        )
      }

      const docsArr = Object.values(docs)

      return children({
        docs: sortDocs(docsArr),
        categories: Doc.categoriesFromDocs(docsArr),
      })
    }}
  </docsContext.Consumer>
)
