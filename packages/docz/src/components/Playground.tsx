import * as React from 'react'
import { Fragment, ComponentType, SFC } from 'react'

import { isFn } from './Docs'

export type RenderComponent = ComponentType<{
  component: JSX.Element
  code: string
}>

export interface PlaygroundProps {
  __code: string
  children: any
  components: any
}

const DefaultRender: RenderComponent = ({ component, code }) => (
  <Fragment>
    {component}
    {code}
  </Fragment>
)

export const Playground: SFC<PlaygroundProps> = ({
  components,
  children,
  __code,
}) => {
  const Render =
    components && components.render ? components.render : DefaultRender

  return (
    <Render component={isFn(children) ? children() : children} code={__code} />
  )
}
