import * as React from 'react'
import { Fragment } from 'react'
import { RenderComponent } from 'docz'
import styled from 'react-emotion'

const Playground = styled('div')`
  background: transparent;
  border: 1px solid ${p => p.theme.colors.border};
  border-bottom: 0;
  border-radius: 5px 5px 0 0;
  ${p => p.theme.styles.playground};
`

const Code = styled('div')`
  pre {
    border-radius: 0 0 5px 5px;
  }
`

export const Render: RenderComponent = ({ component, code }) => (
  <Fragment>
    <Playground>{component}</Playground>
    <Code>{code}</Code>
  </Fragment>
)
