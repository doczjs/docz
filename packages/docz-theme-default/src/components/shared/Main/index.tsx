import { SFC } from 'react'
import { Global, css, jsx } from '@emotion/core'
import styled from '@emotion/styled'
import get from 'lodash.get'

const Wrapper = styled('div')`
  display: flex;
  max-width: 100vw;
`

interface MainProps {
  config: any
}

export const Main: SFC<MainProps> = props => (
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
