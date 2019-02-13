import * as React from 'react'
import { useMemo, SFC } from 'react'
import { useConfig, useDocs } from 'docz'
import styled from 'styled-components'

import { get } from '@utils/theme'

export const LinkStyled = styled.a<any>`
  &,
  &:visited,
  &:active {
    text-decoration: none;
    color: ${get('colors.link')};
  }

  &:hover {
    color: ${get('colors.link')};
  }

  ${get('styles.link')};
`

type LinkProps = React.AnchorHTMLAttributes<any>
export const Link: SFC<LinkProps> = ({ href, ...props }) => {
  const { separator, linkComponent: Link } = useConfig()
  const docs = useDocs()
  const toCheck = useMemo(
    () =>
      [
        location.pathname
          .split(separator)
          .slice(0, -1)
          .join(separator)
          .slice(1),
        (href || '').replace(/^(?:\.\/)+/gi, ''),
      ].join('/'),
    [separator]
  )

  const matched = docs && docs.find(doc => doc.filepath === toCheck)
  const nHref = matched ? matched.route : href
  const isInternal = nHref && nHref.startsWith('/')

  return isInternal ? (
    <LinkStyled as={Link} {...props} to={nHref} />
  ) : (
    <LinkStyled {...props} href={nHref} />
  )
}
