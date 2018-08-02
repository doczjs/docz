import * as React from 'react'
import { SFC } from 'react'
import styled from 'react-emotion'
import { Link as BaseLink } from 'docz'

export const LinkStyled = styled('a')`
  &,
  &:visited,
  &:active {
    text-decoration: none;
    color: ${p => p.theme.docz.colors.link};
  }

  &:hover {
    color: ${p => p.theme.docz.colors.link};
  }
`

type LinkProps = React.AnchorHTMLAttributes<any>

export const Link: SFC<LinkProps> = ({ href, ...props }) => {
  const isInternal = href && href.startsWith('/')
  const Component = isInternal ? LinkStyled.withComponent(BaseLink) : LinkStyled

  return isInternal ? (
    <Component {...props} to={href} />
  ) : (
    <Component {...props} href={href} />
  )
}
