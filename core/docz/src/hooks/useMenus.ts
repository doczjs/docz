import { useMemo, useContext } from 'react'
import { pipe, get, omit, flattenDepth, unionBy } from 'lodash/fp'
import { ulid } from 'ulid'
import match from 'match-sorter'
import sort from 'array-sort'

import { compare, flatArrFromObject } from '../utils/helpers'
import { Entry, MenuItem, doczState } from '../state'

const noMenu = (entry: Entry) => !entry.menu
const fromMenu = (menu: string) => (entry: Entry) => entry.menu === menu
const entryAsMenu = (entry: Entry) => ({
  name: entry.name,
  route: entry.route,
})

const entriesOfMenu = (menu: string, entries: Entry[]) =>
  entries.filter(fromMenu(menu)).map(entryAsMenu)

const parseMenu = (entries: Entry[]) => (name: string) => ({
  name,
  menu: entriesOfMenu(name, entries),
})

type Menus = MenuItem[]

const menusFromEntries = (entries: Entry[]) => {
  const entriesWithoutMenu = entries.filter(noMenu).map(entryAsMenu) as any
  const menus = flatArrFromObject(entries, 'menu').map(parseMenu(entries))
  return unionBy('name', menus, entriesWithoutMenu)
}

const parseItemStr = (item: MenuItem | string) =>
  typeof item === 'string' ? { name: item } : item

const normalize = (item: MenuItem | string): MenuItem => {
  const selected = parseItemStr(item) as MenuItem

  return {
    ...selected,
    id: selected.id || ulid(),
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
  const merged = unionBy('name', first, second) as MenuItem[]

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

const sortByName = (a: MenuItem, b: MenuItem) => {
  return a.name < b.name ? -1 : a.name > b.name ? 1 : 0
}

const sortMenus = (first: Menus, second: Menus | undefined = []): Menus => {
  const sorted: Menus = sort(first, compareWithMenu(second), sortByName)

  return sorted.map(item => {
    if (!item.menu) return item
    const found = second.find(menu => menu.name === item.name)
    const foundMenu = found && found.menu

    return {
      ...item,
      menu: foundMenu
        ? sortMenus(item.menu, foundMenu)
        : sort(item.menu, sortByName),
    }
  })
}

const search = (val: string, menu: MenuItem[]) => {
  const items = menu.map(item => [item].concat(item.menu || []))
  const flattened = flattenDepth(2, items)
  const flattenedDeduplicated = [...new Set(flattened)]
  return match(flattenedDeduplicated, val, { keys: ['name'] })
}

export interface UseMenusParams {
  query?: string
}

export const useMenus = (opts?: UseMenusParams) => {
  const { query = '' } = opts || {}
  const { entries, config } = useContext(doczState.context)
  if (!entries || !config) return null

  const arr = entries.map(({ value }) => value)
  const entriesMenu = menusFromEntries(arr)
  const sorted = useMemo(() => {
    const merged = mergeMenus(entriesMenu as MenuItem[], config.menu)
    return sortMenus(merged, config.menu)
  }, [entries, config])

  return query && query.length > 0
    ? (search(query, sorted) as MenuItem[])
    : sorted
}
