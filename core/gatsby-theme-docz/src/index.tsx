/** @jsx jsx */
import { jsx } from 'theme-ui'
import React from 'react'
import { theme, useConfig, ComponentsProvider } from 'docz'
import { Styled, ThemeProvider } from 'theme-ui'

import components from './components'
import { getTheme } from 'docz-components'

const Theme = ({ children }: React.PropsWithChildren<{}>) => {
  const config = useConfig()

  return (
    <ThemeProvider theme={config.themeConfig}>
      <ComponentsProvider components={components}>
        <Styled.root>{children}</Styled.root>
      </ComponentsProvider>
    </ThemeProvider>
  )
}

export const enhance = theme(
  getTheme(),
  ({
    mode = 'light',
    showPlaygroundEditor = true,
    showLiveError = true,
    ...config
  }) => ({
    ...config,
    showLiveError,
    showPlaygroundEditor,
    initialColorMode: mode,
  })
)

export default enhance(Theme)
