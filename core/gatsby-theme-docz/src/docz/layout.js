/** @jsx jsx */
import { Global } from '@emotion/core'
import { jsx, css, Layout as BaseLayout } from 'theme-ui'
import { ThemeProvider } from 'theme-ui'
import { useConfig } from 'docz'

import global from '@docz/styles/global'

export const Layout = props => {
  const config = useConfig()
  return (
    <ThemeProvider theme={config.themeConfig}>
      <BaseLayout css={css({ '> div': { flex: '1 1 auto' } })}>
        <Global styles={global} />
        {props.children}
      </BaseLayout>
    </ThemeProvider>
  )
}
