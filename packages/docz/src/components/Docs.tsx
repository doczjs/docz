import * as React from 'react'
import { Children } from 'react'

import { dataContext, Entry } from '../theme'

export const isFn = (value: any): boolean => typeof value === 'function'

const sortBy = (a: any, b: any) => {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

const getMenusFromEntries = (entries: Entry[]) =>
  Array.from(
    new Set(
      entries.reduce(
        (arr: string[], entry: Entry): string[] =>
          entry.menu ? arr.concat([entry.menu]) : arr,
        []
      )
    )
  )

export interface DocsRenderProps {
  docs: Entry[]
  menus: string[]
}

export interface DocsProps {
  children?: (renderProps: DocsRenderProps) => React.ReactNode
}

export const Docs: React.SFC<DocsProps> = ({ children }) => {
  if (typeof children !== 'function') return null

  return (
    <dataContext.Consumer>
      {({ entries }) => {
        if (!entries || !children) return null
        if (!isFn(children)) {
          throw new Error(
            'You need to pass a children as a function to your <Docs/> component'
          )
        }

        const entriesArr = Object.values(entries)
        const menus = getMenusFromEntries(entriesArr).sort((a, b) =>
          sortBy(a, b)
        )

        const docs = entriesArr
          .sort((a, b) => sortBy(a.name, b.name))
          .sort((a, b) => a.order - b.order)

        return Children.only(
          children({
            menus,
            docs,
          })
        )
      }}
    </dataContext.Consumer>
  )
}
