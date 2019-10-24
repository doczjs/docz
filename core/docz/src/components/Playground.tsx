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
  language?: string
  showLivePreview?: boolean
}

export const Playground: SFC<PlaygroundProps> = ({
  className,
  children,
  style,
  wrapper,
  __scope,
  __position,
  __code,
  language,
  showLivePreview = true,
}) => {
  const components = useComponents()
  if (!components || !components.playground) return null

  return (
    <components.playground
      components={components}
      component={children}
      className={className}
      style={style}
      wrapper={wrapper}
      scope={__scope}
      position={__position}
      code={__code}
      showLivePreview={showLivePreview}
      language={language}
    />
  )
}
