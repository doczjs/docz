import { FC } from 'react'
import styled from '@emotion/styled'
import get from 'lodash.get'
import { Global, css, jsx } from '@emotion/core'

const Wrapper = styled('div')`
  display: flex;
  max-width: 100vw;
`

interface MainProps {
  config: any
}

export const Main: FC<MainProps> = props => (
  <Wrapper>
    <Global
      styles={css`
        body {
          ${get(props, 'config.themeConfig.styles.body')}
        }
      `}
    />
    {props.children}
  </Wrapper>
)
