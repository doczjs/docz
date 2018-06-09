import * as React from 'react'
import { ThemeConfig } from 'docz'
import { HashLoader } from 'react-spinners'
import styled from 'react-emotion'

const Wrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
`

export const Loading = () => (
  <ThemeConfig>
    {config => (
      <Wrapper>
        <HashLoader color={config.colors.primary} />
      </Wrapper>
    )}
  </ThemeConfig>
)
