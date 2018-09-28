import * as React from 'react'
import { ReactNode, SFC } from 'react'
import merge from 'deepmerge'

import { themeContext } from '../theme'
import { state, State, Config, ThemeConfig as ThemeConfigObj } from '../state'

export interface ThemeConfigProps {
  children?: (config: ThemeConfigObj) => ReactNode
}

export const configSelector = state.createSelector(
  (state: State) => state.config
)

export const ThemeConfig: SFC<ThemeConfigProps> = ({ children }) => {
  if (typeof children !== 'function') return null

  return (
    <themeContext.Consumer>
      {({ themeConfig: initialThemeConfig, transform }) => (
        <state.Consumer select={[configSelector]}>
          {({ themeConfig, ...config }: Config) => {
            const newThemeConfig = merge(initialThemeConfig, themeConfig)

            return children({
              ...config,
              themeConfig: transform
                ? transform(newThemeConfig)
                : newThemeConfig,
            })
          }}
        </state.Consumer>
      )}
    </themeContext.Consumer>
  )
}
