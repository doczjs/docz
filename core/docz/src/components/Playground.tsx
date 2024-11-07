import React from 'react'
import { ComponentType, FC } from 'react'
import { useComponents } from '../hooks'

export interface PlaygroundProps {
  className?: string
  style?: any
  wrapper?: ComponentType<any>
  children: any
  __scope: Record<string, any>
  __position: number
  __code: string
  useScoping?: boolean
  language?: string
}

export const Playground: FC<PlaygroundProps> = ({
  className,
  children,
  style,
  wrapper,
  __scope,
  __position,
  __code,
  language,
  useScoping,
}) => {
  const components = useComponents()
  const PlaygroundComponent = components.playground
  if (!PlaygroundComponent) return null

  return (
    /* @ts-ignore */
    <PlaygroundComponent
      components={components}
      component={children}
      className={className}
      style={style}
      wrapper={wrapper}
      scope={__scope}
      position={__position}
      code={__code}
      language={language}
      useScoping={useScoping}
    />
  )
}
