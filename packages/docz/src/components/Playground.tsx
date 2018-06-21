import * as React from 'react'
import { SFC } from 'react'
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider'

import { isFn } from './Docs'
import { ComponentsMap } from './DocPreview'

export interface PlaygroundProps {
  __code: (components: ComponentsMap) => any
  children: any
  components: ComponentsMap
}

const BasePlayground: SFC<PlaygroundProps> = ({
  components,
  children,
  __code,
}) => {
  return components && components.render ? (
    <components.render
      component={isFn(children) ? children() : children}
      code={__code(components)}
    />
  ) : null
}

export const Playground = withMDXComponents(BasePlayground)
