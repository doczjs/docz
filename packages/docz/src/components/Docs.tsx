import * as React from 'react'
import { Fragment } from 'react'
import sort from 'array-sort'

import { state, Entry } from '../state'
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
    <Fragment>
      {state.get(({ entries, config }) => {
        if (!entries || !config || !children) return null
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

        return children({
          menus,
          docs,
        })
      })}
    </Fragment>
  )
}
