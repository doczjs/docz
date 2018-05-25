import * as React from 'react'
import { Fragment } from 'react'
import { RenderComponent } from 'docz'
import styled from 'react-emotion'

const Playground = styled('div')`
  background: transparent;
  border: 1px solid ${p => p.theme.colors.border};
  border-bottom: 0;
  ${p => p.theme.styles.playground};
`

export const Render: RenderComponent = ({ component, code }) => (
  <Fragment>
    <Playground>{component}</Playground>
    {code}
  </Fragment>
)
