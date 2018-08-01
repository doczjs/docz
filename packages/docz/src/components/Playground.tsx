import * as React from 'react'
import { ComponentType, SFC } from 'react'
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider'

import { isFn } from './Docs'
import { ComponentsMap, Identity } from './DocPreview'

export interface PlaygroundProps {
  components: ComponentsMap
  className?: string
  style?: any
  wrapper?: ComponentType<any>
  children: any
  __position: number
  __code: string
}

const BasePlayground: SFC<PlaygroundProps> = ({
  components,
  className,
  style,
  wrapper: Wrapper = Identity,
  children,
  __position,
  __code,
}) => {
  if (!components || !components.render) return null

  return (
    <components.render
      className={className}
      style={style}
      components={components}
      component={<Wrapper>{isFn(children) ? children() : children}</Wrapper>}
      position={__position}
      code={__code}
    />
  )
}

export const Playground = withMDXComponents(BasePlayground)
