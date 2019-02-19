import * as React from 'react'
import { SFC } from 'react'
import { theme, ComponentsProvider } from 'docz'
import get from 'lodash/get'

import * as modes from './styles/modes'
import { components } from './components/ui'
import { Global } from './styles/global'
import { config } from './config'
import { ThemeProvider } from './utils/theme'

const Theme: SFC = ({ children }) => (
  <ThemeProvider>
    <Global />
    <ComponentsProvider components={components}>{children}</ComponentsProvider>
  </ThemeProvider>
)

const enhance = theme(config, ({ mode, codemirrorTheme, ...config }) => ({
  ...config,
  mode,
  codemirrorTheme: codemirrorTheme || `docz-${mode}`,
  colors: {
    ...get(modes, mode),
    ...config.colors,
  },
}))

export default enhance(Theme)
export { components }
