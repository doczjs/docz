import * as React from 'react'
import { ReactNode, SFC } from 'react'
import merge from 'deepmerge'

import * as selectors from '../state/selectors'
import { state, Config, ThemeConfig as ThemeConfigObj } from '../state'

export interface ThemeConfigProps {
  children?: (config: ThemeConfigObj) => ReactNode
}

export const ThemeConfig: SFC<ThemeConfigProps> = ({ children }) => {
  if (typeof children !== 'function') return null

  return (
    <state.Consumer select={[selectors.config, selectors.theme]}>
      {(config: Config, theme: selectors.ThemeSelector) => {
        const { transform, themeConfig: initialConfig } = theme
        const newThemeConfig = merge(initialConfig || {}, config.themeConfig)

        return children({
          ...config,
          themeConfig: transform ? transform(newThemeConfig) : newThemeConfig,
        })
      }}
    </state.Consumer>
  )
}
