import React, { SFC } from 'react'
import { rem } from 'polished'
import { DocObj } from 'docz'
import styled from 'react-emotion'

import * as colors from '../styles/colors'
import { Render } from './Render'

const Container = styled('div')`
  width: ${rem(960)};
  max-width: ${rem(960)};
  padding: ${rem(50)};
  margin: 0 auto;
`

const Title = styled('h1')`
  position: relative;
  font-size: ${rem(48)};
  font-weight: 200;
  margin: ${rem(20)} 0 ${rem(30)};

  &:before {
    position: absolute;
    content: '';
    bottom: 0;
    left: 0;
    width: 10%;
    height: 3px;
    background: ${colors.PURPLE};
  }
`

const Subtitle = styled('h2')`
  margin: ${rem(50)} 0 ${rem(20)};
  font-size: ${rem(28)};
  font-weight: 200;
`

export const Doc: SFC<DocObj> = ({ id, component: Component }) => (
  <Container key={id}>
    <Component components={{ h1: Title, h2: Subtitle, Render }} />
  </Container>
)
