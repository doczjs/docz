import React, { SFC } from 'react'
import styled from 'react-emotion'
import { DocObj } from 'docz'
import * as Icon from 'react-feather'

import * as colors from '../styles/colors'

const Container = styled('div')`
  width: 960px;
  max-width: 960px;
  padding: 50px;
  margin: 0 auto;
`

const Title = styled('h2')`
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

const IconLink = styled(Icon.Link)`
  margin-right: 10px;
`

const Filepath = styled('div')`
  display: flex;
  align-items: center;
  margin: 15px 0 0;
  color: ${colors.GRAY_MEDIUM};
`

export const Doc: SFC<DocObj> = ({
  id,
  name,
  filepath,
  component: Component,
}) => (
  <Container key={id}>
    <Title>{name}</Title>
    <Filepath>
      <IconLink size={15} />
      <code>{filepath}</code>
    </Filepath>
    <Component />
  </Container>
)
