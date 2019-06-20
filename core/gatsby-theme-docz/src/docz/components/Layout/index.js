/** @jsx jsx */
import { jsx, css, Layout as BaseLayout, Main, Container } from 'theme-ui'
import { Global } from '@emotion/core'

import global from '@docz/theme/global'
import { Header } from '../Header'

export const Layout = ({ children }) => (
  <BaseLayout css={{ '> div': { flex: '1 1 auto' } }}>
    <Global styles={global} />
    <Main>
      <Header />
      <Container>{children}</Container>
    </Main>
  </BaseLayout>
)
