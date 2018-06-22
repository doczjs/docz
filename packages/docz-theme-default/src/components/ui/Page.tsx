import * as React from 'react'
import { PageProps } from 'docz'
import { SFC } from 'react'
import styled from 'react-emotion'

export const Container = styled('div')`
  margin: 0 auto;
  ${p => p.theme.styles.container};
`

const Wrapper = styled('div')`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  color: ${p => p.theme.colors.text};
  background: ${p => p.theme.colors.background};
`

export const Page: SFC<PageProps> = ({ children, ...props }) => (
  <Wrapper>
    <Container>{children}</Container>
  </Wrapper>
)
