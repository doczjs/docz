import * as React from 'react'
import { SFC } from 'react'
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider'

import { isFn } from './Docs'
import { ComponentsMap } from './DocPreview'

export interface PlaygroundProps {
  className?: string
  style?: any
  components: ComponentsMap
  __position: number
  __code: (components: ComponentsMap) => any
  __rawCode: string
  children: any
}

const BasePlayground: SFC<PlaygroundProps> = ({
  components,
  className,
  style,
  children,
  __position,
  __code,
  __rawCode,
}) => {
  return components && components.render ? (
    <components.render
      className={className}
      style={style}
      components={components}
      component={isFn(children) ? children() : children}
      position={__position}
      code={__code(components)}
      rawCode={__rawCode}
    />
  ) : null
}

export const Playground = withMDXComponents(BasePlayground)
