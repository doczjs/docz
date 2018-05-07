import React, { SFC } from 'react'
import styled from 'react-emotion'
import { DocObj } from 'docz'

import * as colors from '../styles/colors'

const Container = styled('div')`
  width: 960px;
  max-width: 960px;
  padding: 50px;
  margin: 0 auto;
`

const Title = styled('h1')`
  position: relative;
  font-size: 48px;
  font-weight: 200;
  margin: 0;

  &:before {
    position: absolute;
    content: '';
    bottom: 0;
    left: 0;
    width: 10%;
    height: 4px;
    background: ${colors.PURPLE};
  }
`

export const Doc: SFC<DocObj> = ({ id, component: Component }) => (
  <Container key={id}>
    <Component components={{ h1: Title }} />
  </Container>
)
