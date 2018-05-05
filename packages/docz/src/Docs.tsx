import * as React from 'react'

import { DocObj } from './Doc'

export const isFn = (value: any): boolean => typeof value === 'function'
export const docsContext = React.createContext([] as DocObj[])

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

      console.log(docs)

      return children({ docs, categories: [] })
    }}
  </docsContext.Consumer>
)
