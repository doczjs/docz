import * as React from 'react'
import { SFC } from 'react'
import { jsx } from '@emotion/core'
import { Docs, ThemeConfig } from 'docz'
import styled from '@emotion/styled'

import { get } from '@utils/theme'

export const LinkStyled = styled('a')`
  &,
  &:visited,
  &:active {
    text-decoration: none;
    color: ${get('colors.link')};
  }

  &:hover {
    color: ${get('colors.link')};
  }
`

type LinkProps = React.AnchorHTMLAttributes<any>
export const Link: SFC<LinkProps> = ({ href, ...props }) => (
  <Docs>
    {({ docs }) => (
      <ThemeConfig>
        {({ separator, linkComponent: Link }) => {
          // calculate matched route
          const matched = docs.find(
            doc =>
              doc.filepath ===
              [
                location.pathname
                  .split(separator)
                  .slice(0, -1)
                  .join(separator)
                  .slice(1),
                (href || '').replace(/^(?:\.\/)+/gi, ''),
              ].join('/')
          )
          matched && (href = matched.route)

          const isInternal = href && href.startsWith('/')
          const Component = isInternal
            ? LinkStyled.withComponent(Link)
            : LinkStyled

          return isInternal ? (
            <Component {...props} to={href} />
          ) : (
            <Component {...props} href={href} />
          )
        }}
      </ThemeConfig>
    )}
  </Docs>
)
