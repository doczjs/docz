import * as React from 'react'
import { Fragment } from 'react'
import { RenderComponent } from 'docz'
import styled from 'react-emotion'

import * as colors from '../styles/colors'

const ComponentWrapper = styled('div')`
  position: relative;
  padding: 50px;
  background: white;
  border: 1px solid ${colors.GRAY};
  border-radius: 3px 3px 0 0;
`

const CodeWrapper = styled('div')`
  border: 1px solid ${colors.GRAY};
  border-top: 0;
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
