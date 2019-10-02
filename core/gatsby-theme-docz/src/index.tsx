/** @jsx jsx */
import { jsx } from 'theme-ui'
import { theme, useConfig, ComponentsProvider } from 'docz'
import { Styled, ThemeProvider } from 'theme-ui'

import defaultTheme from './theme'
import components from './components'

const Theme = ({ children }: React.PropsWithChildren<{}>) => {
  const config = useConfig()
  const { layout, playground, ...rest } = components
  console.log(layout, playground)
  return (
    <ThemeProvider theme={config.themeConfig}>
      <ComponentsProvider components={rest}>
        <Styled.root>{children}</Styled.root>
      </ComponentsProvider>
    </ThemeProvider>
  )
}

export const enhance = theme(
  defaultTheme,
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
