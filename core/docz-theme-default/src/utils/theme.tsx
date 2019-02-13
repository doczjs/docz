import * as React from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { useConfig } from 'docz'
import getter from 'lodash.get'

export const get = (val: string, defaultValue?: any) => (p: any) =>
  getter(p, `theme.docz.${val}`, defaultValue)

export const ThemeProvider: React.SFC = ({ children }) => {
  const config = useConfig()
  const next = (prev: any) => ({ ...prev, docz: config.themeConfig })
  return (
    <StyledThemeProvider theme={next}>
      <React.Fragment>{children}</React.Fragment>
    </StyledThemeProvider>
  )
}
