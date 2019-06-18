import React from 'react'
import { Link as BaseLink } from 'gatsby'

export const Link = props => (
  <BaseLink
    {...props}
    getProps={({ isCurrent, ...customProps }) =>
      isCurrent ? { className: `${props.className} active` } : null
    }
  />
)
