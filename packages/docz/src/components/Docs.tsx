import * as React from 'react'
import { Children } from 'react'

import { dataContext, Entry } from '../theme'

export const isFn = (value: any): boolean => typeof value === 'function'

const sortAlphabetically = (a: Entry, b: Entry) => {
  if (a.name < b.name) return -1
  if (a.name > b.name) return 1
  return 0
}

const getDocsFromEntries = (entries: Entry[]) =>
  entries.sort((a, b) => b.order - a.order)

const getCategoriesFromEntries = (entries: Entry[]) =>
  Array.from(
    new Set([...entries.map(entry => entry.menu).filter(c => Boolean(c))])
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
    {({ entries }) => {
      if (!entries) return null
      if (!isFn(children)) {
        throw new Error(
          'You need to pass a children as a function to your <Docs/> component'
        )
      }

      const sortedEntries = Object.values(entries).sort(sortAlphabetically)
      const docs = getDocsFromEntries(sortedEntries)
      const menus = getCategoriesFromEntries(sortedEntries)

      return Children.only(
        children({
          docs,
          menus,
        })
      )
    }}
  </dataContext.Consumer>
)
