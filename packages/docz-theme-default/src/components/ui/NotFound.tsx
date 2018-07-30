import * as React from 'react'
import { ThemeConfig } from 'docz'
import styled from 'react-emotion'

import { Sidebar, Main } from '../shared'

const Wrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  color: ${p => p.theme.colors.text};
  background: ${p => p.theme.colors.background};
`

const Title = styled('h1')`
  margin: 0;
  font-size: 42px;
  font-weight: 400;
  color: ${p => p.theme.colors.primary};
`

const Subtitle = styled('p')`
  margin: 0;
  font-size: 18px;
`

export const NotFound = () => (
  <ThemeConfig>
    {config => (
      <Main config={config}>
        <Sidebar />
        <Wrapper>
          <Title>Page Not Found</Title>
          <Subtitle>
            Check if you haven't changed the document route or deleted it!
          </Subtitle>
        </Wrapper>
      </Main>
    )}
  </ThemeConfig>
)
