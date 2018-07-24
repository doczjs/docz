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
  __code: (components: ComponentsMap) => any
  __rawCode: string
}

const BasePlayground: SFC<PlaygroundProps> = ({
  components,
  className,
  style,
  wrapper: Wrapper = Identity,
  children,
  __position,
  __code,
  __rawCode,
}) => {
  return components && components.render ? (
    <Wrapper>
      <components.render
        className={className}
        style={style}
        components={components}
        component={isFn(children) ? children() : children}
        position={__position}
        code={__code(components)}
        rawCode={__rawCode}
      />
    </Wrapper>
  ) : null
}

export const Playground = withMDXComponents(BasePlayground)
