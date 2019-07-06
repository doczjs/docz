/** @jsx jsx */
import { jsx } from 'theme-ui'
import { theme, useConfig, ComponentsProvider } from 'docz'
import { Styled, ThemeProvider } from 'theme-ui'

import defaultTheme from '~theme'
import { componentsMap } from '~components'

const Theme = ({ children }) => {
  const config = useConfig()
  return (
    <ThemeProvider theme={config.themeConfig}>
      <ComponentsProvider components={componentsMap}>
        <Styled.root>{children}</Styled.root>
      </ComponentsProvider>
    </ThemeProvider>
  )
}

export const enhance = theme(defaultTheme, ({ mode = 'light', ...config }) => ({
  ...config,
  initialColorMode: mode,
}))

export default enhance(Theme)
