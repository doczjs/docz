import * as React from 'react'
import { Fragment } from 'react'
import { RenderComponent } from 'docz'
import styled from 'react-emotion'

const Playground = styled('div')`
  background: 'render';
  border: 1px solid ${p => p.theme.colors.border};
  border-bottom: 0;
  border-radius: 5px 5px 0 0;
  ${p => p.theme.mq(p.theme.styles.playground)};
`

const Code = styled('div')`
  & code[class*='language-'],
  & pre[class*='language-'] {
    margin: 0;
    border-radius: 0 0 5px 5px;

    ${p =>
      p.theme.mq({
        overflowY: ['hidden', 'hidden', 'hidden', 'initial'],
      })};
  }
`

export const Render: RenderComponent = ({ component, code }) => (
  <Fragment>
    <Playground>{component}</Playground>
    <Code>{code}</Code>
  </Fragment>
)
