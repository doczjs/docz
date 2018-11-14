import * as React from 'react'
import { Fragment } from 'react'
import { pipe, get, omit } from 'lodash/fp'
import { ulid } from 'ulid'
import sort from 'array-sort'

import { compare, isFn, flatArrFromObject, mergeArrBy } from '../utils/helpers'
import { state, Entry, MenuItem } from '../state'

const noMenu = (entry: Entry) => !entry.menu
const fromMenu = (menu: string) => (entry: Entry) => entry.menu === menu
const entryAsMenu = (entry: Entry) => ({
  name: entry.name,
  route: entry.route,
  order: entry.order || 0,
})

const entriesOfMenu = (menu: string, entries: Entry[]) =>
  entries.filter(fromMenu(menu)).map(entryAsMenu)

const parseMenu = (entries: Entry[]) => (name: string) => ({
  name,
  menu: entriesOfMenu(name, entries),
})

type Menus = MenuItem[]

const menusFromEntries = (entries: Entry[]) => {
  const entriesWithoutMenu = entries.filter(noMenu).map(entryAsMenu)
  const menus = flatArrFromObject(entries, 'menu').map(parseMenu(entries))

  return [...entriesWithoutMenu, ...menus]
}

const parseItemStr = (item: MenuItem | string) =>
  typeof item === 'string' ? { name: item } : item

const normalize = (item: MenuItem | string): MenuItem => {
  const selected = parseItemStr(item) as MenuItem

  return {
    ...selected,
    id: selected.id || ulid(),
    order: selected.order || 0,
    menu: Array.isArray(selected.menu)
      ? selected.menu.map(normalize)
      : selected.menu,
  }
}

const clean = (item: MenuItem) =>
  item.href || item.route ? omit('menu', item) : item

const normalizeAndClean = pipe(
  normalize,
  clean
)

const mergeMenus = (entriesMenu: Menus, configMenu: Menus): Menus => {
  const first = entriesMenu.map(normalizeAndClean)
  const second = configMenu.map(normalizeAndClean)
  const merged = mergeArrBy<MenuItem>('name', first, second)

  return merged.map(item => {
    if (!item.menu) return item
    const found: any = second.find(i => i.name === item.name)
    const foundMenu = found && found.menu

    return {
      ...item,
      menu: foundMenu
        ? mergeMenus(item.menu, foundMenu)
        : item.menu || found.menu,
    }
  })
}

const UNKNOWN_POS = Infinity

const findPos = (item: any, orderedList: string[] = []) => {
  const name = typeof item !== 'string' ? get('name', item) : item
  const pos = orderedList.findIndex(item => item === name)

  return pos !== -1 ? pos : UNKNOWN_POS
}

type ToCompare = Menus | undefined
const compareWithMenu = (to: ToCompare = []) => (a: string, b: string) => {
  const list = to.map((i: any) => i.name || i)
  return compare(findPos(a, list), findPos(b, list))
}

const sortMenus = (
  first: Menus,
  second: Menus | undefined = [],
  reverse: boolean
): Menus => {
  const sorted: Menus = sort(
    first,
    compareWithMenu(second),
    (a: Entry, b: Entry) => compare(a.order, b.order, reverse)
  )

  return sorted.map(item => {
    if (!item.menu) return item
    const found = second.find(menu => menu.name === item.name)
    const foundMenu = found && found.menu

    return {
      ...item,
      menu: foundMenu ? sortMenus(item.menu, foundMenu, reverse) : item.menu,
    }
  })
}

export type MenuRenderProps = Menus

export interface DocsProps {
  children?: (renderProps: MenuRenderProps) => React.ReactNode
}

export const Menu: React.SFC<DocsProps> = ({ children }) => {
  if (typeof children !== 'function') return null

  return (
    <Fragment>
      {state.get(({ entries, config }) => {
        if (!entries || !config || !children) return null
        if (!isFn(children)) {
          throw new Error(
            'You need to pass a children as a function to your <Docs/> component'
          )
        }

        const reverse = config.ordering === 'descending'
        const arr = Object.values(entries)
        const entriesMenu = menusFromEntries(arr)
        const merged = mergeMenus(entriesMenu as MenuItem[], config.menu)
        const menus = sortMenus(merged, config.menu, reverse)

        return children(menus)
      })}
    </Fragment>
  )
}
