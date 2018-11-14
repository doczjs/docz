import * as React from 'react'
import { SFC } from 'react'
import { NavLinkProps as LinkProps } from 'react-router-dom'
import { NavHashLink as NavLink } from 'react-router-hash-link'

export const Link: SFC<LinkProps> = props => <NavLink {...props} exact={true} />
export { LinkProps }
