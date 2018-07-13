import * as React from 'react'
import { SFC } from 'react'
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider'

import { isFn } from './Docs'
import { ComponentsMap } from './DocPreview'

export interface PlaygroundProps {
  components: ComponentsMap
  className?: string
  style?: any
  children: any
  __code: (components: ComponentsMap) => any
}

const BasePlayground: SFC<PlaygroundProps> = ({
  components,
  className,
  style,
  children,
  __code,
}) => {
  return components && components.render ? (
    <components.render
      className={className}
      style={style}
      component={isFn(children) ? children() : children}
      code={__code(components)}
    />
  ) : null
}

export const Playground = withMDXComponents(BasePlayground)
