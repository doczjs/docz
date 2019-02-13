import * as React from 'react'
import { Fragment, ReactNode, SFC } from 'react'
import merge from 'deepmerge'

import { state, ThemeConfig as ThemeConfigObj } from '../state'

export interface ThemeConfigProps {
  children?: (config: ThemeConfigObj) => ReactNode
}

export const ThemeConfig: SFC<ThemeConfigProps> = ({ children }) => {
  if (typeof children !== 'function') return null

  return (
    <Fragment>
      {state.get(({ linkComponent, transform, config, themeConfig = {} }) => {
        const newConfig = merge(themeConfig, config ? config.themeConfig : {})
        const transformed = transform ? transform(newConfig) : newConfig

        return children({
          ...config,
          linkComponent,
          themeConfig: transformed,
        })
      })}
    </Fragment>
  )
}
