import * as React from 'react'
import { Fragment } from 'react'
import { RenderComponent } from 'docz'
import styled from 'react-emotion'

import * as colors from '../styles/colors'

const ComponentWrapper = styled('div')`
  padding: 2rem;
  background: transparent;
  border: 1px solid ${colors.border};
  border-bottom: 0;
  border-radius: 3px 3px 0 0;
`

const CodeWrapper = styled('div')`
  border-radius: 0 0 3px 3px;

  pre {
    border-radius: 0 0 3px 3px;
  }
`

export const Render: RenderComponent = ({ component, code }) => (
  <Fragment>
    <ComponentWrapper>{component}</ComponentWrapper>
    <CodeWrapper>{code}</CodeWrapper>
  </Fragment>
)
