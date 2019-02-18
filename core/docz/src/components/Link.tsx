import * as React from 'react'
import { useCallback } from 'react'
import { Link as BaseLink, LinkProps, LinkGetProps } from '@reach/router'

export { LinkProps }
export const Link = React.forwardRef<any, LinkProps<any>>((props, ref) => {
  const isActive = useCallback(
    ({ isCurrent, location }: LinkGetProps) => {
      const hrefHash = props.to && props.to.split('#')
      const slug = hrefHash && Array.isArray(hrefHash) && hrefHash[1]
      const isActive =
        slug && location.hash && slug === location.hash.slice(1, Infinity)
      return isCurrent || isActive
        ? { className: `${props.className} active` }
        : {}
    },
    [props.to, props.className]
  )

  return <BaseLink {...props} getProps={isActive} ref={ref} />
})

Link.displayName = 'Link'
