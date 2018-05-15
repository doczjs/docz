import * as React from 'react'
import { Children } from 'react'

import { dataContext, Entry, EntryMap } from '../theme'

export const isFn = (value: any): boolean => typeof value === 'function'

const getDocsFromEntries = (entries: EntryMap) =>
  Object.values(entries).sort((entryA, entryB) => entryB.order - entryA.order)

const getCategoriesFromEntries = (entries: EntryMap) =>
  Array.from(
    new Set([
      ...Object.values(entries)
        .map(entry => entry.menu)
        .filter(c => Boolean(c)),
    ])
  )

export interface DocsRenderProps {
  docs: Entry[]
  menus: Array<string | null>
}

export interface DocsProps {
  children: (renderProps: DocsRenderProps) => React.ReactNode
}

export const Docs: React.SFC<DocsProps> = ({ children }) => (
  <dataContext.Consumer>
    {({ data }) => {
      if (!data.entries) return null
      if (!isFn(children)) {
        throw new Error(
          'You need to pass a children as a function to your <Docs/> component'
        )
      }

      const docs = getDocsFromEntries(data.entries)
      const menus = getCategoriesFromEntries(data.entries)

      return Children.only(
        children({
          docs,
          menus,
        })
      )
    }}
  </dataContext.Consumer>
)
