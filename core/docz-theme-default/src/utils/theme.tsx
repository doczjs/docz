import * as React from 'react'
import { Global } from '@emotion/core'
import { ThemeProvider as StyledThemeProvider } from 'emotion-theming'
import { useConfig } from 'docz'
import getter from 'lodash/get'
import { globalStyles } from '~styles/global'

export const get = (val: string, defaultValue?: any) => (p: any) =>
  getter(p, `theme.docz.${val}`, defaultValue)

export const ThemeProvider: React.SFC = ({ children }) => {
  const config = useConfig()
  const next = (prev: any) => ({ ...prev, docz: config.themeConfig })
  return (
    <StyledThemeProvider theme={next}>
      <Global styles={globalStyles({ theme: next })} />
      <React.Fragment>{children}</React.Fragment>
    </StyledThemeProvider>
  )
}
