import * as React from 'react'
import { useCallback } from 'react'
import { Link as BaseLink, LinkProps, LinkGetProps } from '@reach/router'

declare var DOCZ_BASE_URL: string

export { LinkProps }
export const Link = React.forwardRef<any, LinkProps<any>>((props, ref) => {
  const isActive = useCallback(
    ({ isCurrent }: LinkGetProps) => {
      return isCurrent ? { className: `${props.className} active` } : {}
    },
    [props.className]
  )

  const base = DOCZ_BASE_URL.slice(0, -1)
  const { to } = props
  const link = `${base}${to}`

  return <BaseLink {...props} to={link} getProps={isActive} ref={ref} />
})

Link.displayName = 'Link'
