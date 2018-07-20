import * as React from 'react'
import { PageProps, ThemeConfig } from 'docz'
import { SFC } from 'react'
import styled from 'react-emotion'

import { Sidebar, Main } from '../shared'

export const Container = styled('div')`
  margin: 0 auto;
  width: 960px;
  max-width: 100%;
  ${p => p.theme.mq(p.theme.styles.container)};
`

const Wrapper = styled('div')`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  color: ${p => p.theme.colors.text};
  background: ${p => p.theme.colors.background};
`

export const Page: SFC<PageProps> = ({ children, doc: { fullpage } }) => {
  return (
    <ThemeConfig>
      {config => (
        <Main config={config}>
          {!fullpage && <Sidebar />}
          <Wrapper>
            {fullpage ? children : <Container>{children}</Container>}
          </Wrapper>
        </Main>
      )}
    </ThemeConfig>
  )
}
