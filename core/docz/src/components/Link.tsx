import * as React from 'react'
import { useCallback } from 'react'
import { Link as BaseLink, LinkProps, LinkGetProps } from '@reach/router'

export { LinkProps }
export const Link = React.forwardRef<any, LinkProps<any>>((props, ref) => {
  const isActive = useCallback(
    ({ isCurrent }: LinkGetProps) => {
      return isCurrent ? { className: `${props.className} active` } : {}
    },
    [props.className]
  )

  return <BaseLink {...props} getProps={isActive} ref={ref} />
})

Link.displayName = 'Link'
