import * as React from 'react'
import styled from '@emotion/styled'

import { Sidebar, Main } from '../shared'
import { get } from '~utils/theme'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  color: ${get('colors.text')};
  background: ${get('colors.background')};
`

const Title = styled.h1`
  margin: 0;
  font-size: 42px;
  font-weight: 400;
  color: ${get('colors.primary')};
`

const Subtitle = styled.p`
  margin: 0;
  font-size: 18px;
`

export const NotFound = () => (
  <Main>
    <Sidebar />
    <Wrapper>
      <Title>Page Not Found</Title>
      <Subtitle>
        Check if you changed the document route or deleted it!
      </Subtitle>
    </Wrapper>
  </Main>
)
