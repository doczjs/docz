import * as React from 'react'
import { Fragment } from 'react'
import { RenderComponent } from 'docz'
import styled from 'react-emotion'

const Playground = styled('div')`
  background: transparent;
  border: 1px solid ${p => p.theme.colors.border};
  border-bottom: 0;
  border-radius: 3px 3px 0 0;
  ${p => p.theme.styles.playground};
`

const Code = styled('div')`
  border-radius: 0 0 3px 3px;

  pre {
    border-radius: 0 0 3px 3px;
  }
`

export const Render: RenderComponent = ({ component, code }) => (
  <Fragment>
    <Playground>{component}</Playground>
    <Code>{code}</Code>
  </Fragment>
)
