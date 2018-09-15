import * as React from 'react'
import { Children } from 'react'
import sort from 'array-sort'

import { state, Entry, EntryMap, Config } from '../state'
import { entriesSelector } from './DocPreview'
import { configSelector } from './ThemeConfig'
import { compare, flatArrFromObject, isFn } from '../utils/helpers'

export interface DocsRenderProps {
  docs: Entry[]
  /**
   * @deprecated Since the new <Menu> component now support
   * ordering by set menu property on config file
   * will be deleted in v1.0
   */
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

        /** TODO: remove all order and  logic from here in a breaking change */
        const menusArr = flatArrFromObject<Entry>(arr, 'menu')
        const menus = sort(menusArr, (a: string, b: string) => compare(a, b))
        const descending = config.ordering === 'descending'
        const docs: Entry[] = sort(
          arr,
          (a: Entry, b: Entry) => compare(a.order, b.order, descending),
          (a: Entry, b: Entry) => compare(a.name, b.name)
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
