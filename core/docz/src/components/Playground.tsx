import * as React from 'react'
import { ComponentType, SFC } from 'react'

import { useComponents } from '../hooks'

export interface PlaygroundProps {
  className?: string
  style?: any
  wrapper?: ComponentType<any>
  children: any
  editorCode?: string
  __scope: Record<string, any>
  __position: number
  __code: string
  __codesandbox: string
}

const Playground: SFC<PlaygroundProps> = ({
  className,
  style,
  wrapper: Wrapper,
  children,
  editorCode,
  __scope,
  __position,
  __code,
  __codesandbox,
}) => {
  const components = useComponents()
  if (!components || !components.playground) return null
  const props = { className, style, components, editorCode }

  return (
    <components.playground
      {...props}
      component={children}
      wrapper={Wrapper}
      scope={__scope}
      position={__position}
      code={__code}
      codesandbox={__codesandbox}
    />
  )
}

export default Playground
