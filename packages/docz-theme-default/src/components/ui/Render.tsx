import * as React from 'react'
import { Fragment } from 'react'
import { RenderComponent } from 'docz'
import styled from 'react-emotion'

import { Pre as PreBase } from './Pre'

const Playground = styled('div')`
  background: 'white';
  border: 1px solid ${p => p.theme.colors.border};
  border-bottom: 0;
  border-radius: 5px 5px 0 0;
  ${p => p.theme.mq(p.theme.styles.playground)};
`

const Pre = styled(PreBase)`
  margin: 0;
  border-radius: 0 0 5px 5px;
`

export const Render: RenderComponent = ({
  className,
  style,
  component,
  rawCode,
}) => {
  return (
    <Fragment>
      <Playground className={className} style={style}>
        {component}
      </Playground>
      <Pre>{rawCode}</Pre>
    </Fragment>
  )
}
