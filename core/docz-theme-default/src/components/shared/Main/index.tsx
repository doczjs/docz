import { SFC } from 'react'
import { Global, jsx } from '@emotion/core'
import styled from '@emotion/styled'

import { styles } from '../../../styles/global'

const Wrapper = styled('div')`
  display: flex;
  max-width: 100vw;
`

interface MainProps {
  config: any
}

export const Main: SFC<MainProps> = props => (
  <Wrapper>
    <Global styles={styles(props)} />
    {props.children}
  </Wrapper>
)
