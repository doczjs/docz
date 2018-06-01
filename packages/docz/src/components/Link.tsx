import * as React from 'react'
import { SFC } from 'react'
import { NavLink, NavLinkProps } from 'react-router-dom'

export const isActive = (match: any, location: any) =>
  match && match.url === location.pathname

export const Link: SFC<NavLinkProps> = props => (
  <NavLink isActive={isActive} {...props} />
)
