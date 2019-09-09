import * as React from 'react'
import { ComponentType, SFC } from 'react'
import {
  Playground as DoczPlayground,
  PlaygroundProps as InternalPlaygroundProps,
} from 'docz-components'
import { useConfig } from '../hooks/useConfig'

export interface PlaygroundProps {
  className?: string
  style?: any
  wrapper?: ComponentType<any>
  children: any
  __scope: Record<string, any>
  __position: number
  __code: string
  language?: InternalPlaygroundProps['language']
  showLivePreview?: boolean
}

export const Playground: SFC<PlaygroundProps> = ({
  className,
  style,
  wrapper: Wrapper,
  __scope,
  __position,
  __code,
  language,
  showLivePreview: showLivePreviewFromUser = true,
}) => {
  const {
    themeConfig: {
      showPlaygroundEditor,
      showLiveError,
      showLivePreview = showLivePreviewFromUser,
    },
  } = useConfig()

  return (
    <DoczPlayground
      className={className}
      style={style}
      wrapper={Wrapper}
      scope={__scope}
      position={__position}
      code={__code}
      showPlaygroundEditor={showPlaygroundEditor}
      showLiveError={showLiveError}
      showLivePreview={showLivePreview}
      language={language}
    />
  )
}
