import * as React from 'react'
import { SFC, Children } from 'react'

import { dataContext, ThemeConfig as Config } from '../theme'

export interface ThemeConfigProps {
  children?: (config: Config) => React.ReactNode
}

export const ThemeConfig: SFC<ThemeConfigProps> = ({ children }) => {
  if (typeof children !== 'function') return null

  return (
    <dataContext.Consumer>
      {({ config }) => Children.only(children(config))}
    </dataContext.Consumer>
  )
}
