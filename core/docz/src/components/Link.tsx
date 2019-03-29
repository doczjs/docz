import * as React from 'react'
import { useCallback } from 'react'
import { Link as BaseLink, LinkProps, LinkGetProps } from '@reach/router'
import { omit } from 'lodash/fp'

export { LinkProps }
export const Link = React.forwardRef<any, LinkProps<any>>(
  (defaultProps, ref) => {
    const props = omit(['activeClassName', 'partiallyActive'], defaultProps)
    const isActive = useCallback(
      ({ isCurrent }: LinkGetProps) => {
        return isCurrent ? { className: `${props.className} active` } : {}
      },
      [props.className]
    )

    return <BaseLink {...props} getProps={isActive} ref={ref} />
  }
)

Link.displayName = 'Link'
