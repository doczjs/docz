import * as React from 'react'
import { ComponentType, SFC } from 'react'

import { useComponents } from '../hooks'

export interface PlaygroundProps {
  className?: string
  style?: any
  wrapper?: ComponentType<any>
  children: any
  __scope: Record<string, any>
  __position: number
  __code: string
}

export const Playground: SFC<PlaygroundProps> = ({
  className,
  style,
  wrapper: Wrapper,
  children,
  __scope,
  __position,
  __code,
}) => {
  const components = useComponents()
  if (!components || !components.playground) return null
  const props = { className, style, components }

  return (
    <components.playground
      {...props}
      component={children}
      wrapper={Wrapper}
      scope={__scope}
      position={__position}
      code={__code}
    />
  )
}
