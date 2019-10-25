/** @jsx jsx */
import { jsx } from 'theme-ui'
import { theme, useConfig, ComponentsProvider } from 'docz'
import { Styled, ThemeProvider } from 'theme-ui'

import defaultTheme from '~theme'
import components from '~components'

const Theme = ({ children }) => {
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
  defaultTheme,
  ({
    mode = 'light',
    showLiveError = true,
    showLivePreview = true,
    showPlaygroundEditor = true,
    ...config
  }) => ({
    ...config,
    showLiveError,
    showLivePreview,
    showPlaygroundEditor,
    initialColorMode: mode,
  })
)

export default enhance(Theme)
