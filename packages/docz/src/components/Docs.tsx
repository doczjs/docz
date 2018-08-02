import * as React from 'react'
import { Children } from 'react'
import sort from 'array-sort'

import { state, Entry, EntryMap, Config } from '../state'
import { entriesSelector } from './DocPreview'
import { configSelector } from './ThemeConfig'

export const isFn = (value: any): boolean => typeof value === 'function'

const sortBy = (a: any, b: any, reverse?: boolean) => {
  if (a < b) return reverse ? 1 : -1
  if (a > b) return reverse ? -1 : 1
  return 0
}

const menuFromEntries = (entries: Entry[]) =>
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
    <state.Consumer select={[entriesSelector, configSelector]}>
      {(entries: EntryMap, config: Config) => {
        if (!entries || !children) return null
        if (!isFn(children)) {
          throw new Error(
            'You need to pass a children as a function to your <Docs/> component'
          )
        }

        const arr = Object.values(entries)
        const menusArr = menuFromEntries(arr)
        const menus = sort(menusArr, (a: Entry, b: Entry) => sortBy(a, b))
        const descending = config.ordering === 'descending'

        const docs: Entry[] = sort(
          arr,
          (a: Entry, b: Entry) => sortBy(a.order, b.order, descending),
          (a: Entry, b: Entry) => sortBy(a.name, b.name)
        )

        return Children.only(
          children({
            menus,
            docs,
          })
        )
      }}
    </state.Consumer>
  )
}
