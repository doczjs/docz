import * as React from 'react'
import { Children } from 'react'
import sort from 'array-sort'

import { state, Entry, EntryMap, Config, MenuConfig } from '../state'
import { entriesSelector } from './DocPreview'
import { configSelector } from './ThemeConfig'

export const isFn = (value: any): boolean => typeof value === 'function'

const compare = (a: any, b: any, reverse?: boolean) => {
  if (a < b) return reverse ? 1 : -1
  if (a > b) return reverse ? -1 : 1
  return 0
}

const UNKNOWN_POS = Infinity

const comparePositionInConfig = (
  a: string,
  b: string,
  menu: string | null,
  config: Config
) => {  

  if(config.menu) {
    const orderedMenuList = config.menu.map(m => {
      return typeof m === 'string' ? m : m.name
    })

    if(menu) {
      const menuPos = findPos(menu, orderedMenuList)

      if(menuPos !== UNKNOWN_POS && typeof config.menu[menuPos] === 'object') {
        const menuConfig = config.menu[menuPos] as MenuConfig
        const orderedList = menuConfig.docs

        return compare(
          findPos(a, orderedList),
          findPos(b, orderedList)
        )
      }
    } else {
      return compare(
        findPos(a, orderedMenuList),
        findPos(b, orderedMenuList)
      )
    }
  }
  return 0
}

const compareEntryPositionInConfig = (a: Entry, b: Entry, config: Config) => {
  if(a.menu === b.menu) {
    return comparePositionInConfig(a.name, b.name, a.menu, config)
  }
  return 0
}

const findPos = (name: string, orderedList: string[] | null) => {
  if(!orderedList) {
    return UNKNOWN_POS
  }
  const pos = orderedList.findIndex(item => item === name)
  return pos !== -1 ? pos : UNKNOWN_POS
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
        const menus = sort(
          menusArr,
          (a: string, b: string) => comparePositionInConfig(a, b, null, config),
          (a: string, b: string) => compare(a, b)
        )
        const descending = config.ordering === 'descending'

        const docs: Entry[] = sort(
          arr,
          (a: Entry, b: Entry) => compareEntryPositionInConfig(a, b, config),
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
