import * as React from 'react'
import { ReactNode, SFC, Children } from 'react'
import merge from 'deepmerge'

import { themeContext } from '../theme'
import { state, State, Config } from '../state'

export interface ThemeConfigProps {
  children?: (config: any) => ReactNode
}

export const configSelector = state.createSelector(
  (state: State) => state.db.config
)

export const ThemeConfig: SFC<ThemeConfigProps> = ({ children }) => {
  if (typeof children !== 'function') return null

  return (
    <themeContext.Consumer>
      {({ initialConfig, transform }) => (
        <state.Consumer select={[configSelector]}>
          {(config: Config) => {
            const newConfig = merge(initialConfig, config)
            const transformed = transform ? transform(newConfig) : newConfig

            return Children.only(children(transformed))
          }}
        </state.Consumer>
      )}
    </themeContext.Consumer>
  )
}
