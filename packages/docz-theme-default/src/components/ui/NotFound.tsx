import * as React from 'react'
import styled from 'react-emotion'

const Wrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const Title = styled('h1')`
  margin: 0;
  font-size: 48px;
  color: ${p => p.theme.colors.primary};
`

const Subtitle = styled('p')`
  margin: 0;
  font-size: 22px;
`

export const NotFound = () => (
  <Wrapper>
    <Title>Page Not Found</Title>
    <Subtitle>
      Check if you haven't changed the document route or delete it!
    </Subtitle>
  </Wrapper>
)
