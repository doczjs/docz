import * as React from 'react'
import { SFC } from 'react'
import { NavLink, NavLinkProps as LinkProps } from 'react-router-dom'

export const Link: SFC<LinkProps> = props => <NavLink {...props} exact={true} />

export { LinkProps }
