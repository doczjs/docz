import * as React from 'react'
import { SFC } from 'react'
import { Link as BaseLink, LinkProps as BaseLinkProps, Entry } from 'docz'
import { NavHashLink } from 'react-router-hash-link'

import styled, { css } from 'react-emotion'

export const linkStyle = (p: any) => css`
  position: relative;
  display: block;
  margin: 6px 16px;
  font-weight: 600;
  color: ${p.theme.colors.sidebarText};
  text-decoration: none;
  transition: color 0.2s;

  &:hover,
  &:visited {
    color: ${p.theme.colors.sidebarText};
  }

  &:hover,
  &.active {
    color: ${p.theme.colors.primary};
    font-weight: 600;
  }
`

const LinkStyled = styled(BaseLink)`
  ${linkStyle};
`

interface LinkWrapperProps {
  active: boolean
  theme?: any
}

const activeWrapper = (p: LinkWrapperProps) => css`
  &:after {
    position: absolute;
    display: block;
    content: '';
    top: 0;
    left: 0;
    width: 2px;
    height: 100%;
    background: ${p.theme.colors.border};
  }
`

const LinkWrapper = styled('div')`
  position: relative;
  ${(p: LinkWrapperProps) => p.active && activeWrapper(p)};
`

const isActive = (doc: Entry, location: any) => {
  return doc.route === location.pathname
}

const SmallLink = styled(NavHashLink)`
  font-size: 14px;
  padding: 0 0 5px 26px;
  text-decoration: none;
  opacity: 0.5;
  transition: opacity 0.2s;

  &,
  &:visited,
  &.active {
    color: ${p => p.theme.colors.sidebarText};
  }

  &.active {
    opacity: 1;
  }
`

const Submenu = styled('div')`
  display: flex;
  flex-direction: column;
  margin: 5px 0;
`

const isSmallLinkActive = (slug: string) => (m: any, location: any) =>
  slug === location.hash.slice(1, Infinity)

interface LinkProps extends BaseLinkProps {
  doc: Entry
}

export const Link: SFC<LinkProps> = ({ doc, onClick, ...props }) => {
  const active = isActive(doc, location)

  return (
    <LinkWrapper active={active}>
      <LinkStyled {...props} onClick={onClick} />
      {active && (
        <Submenu>
          {doc.headings.map(
            heading =>
              heading.depth > 1 &&
              heading.depth < 3 && (
                <SmallLink
                  key={heading.slug}
                  onClick={onClick}
                  to={{ pathname: doc.route, hash: heading.slug }}
                  isActive={isSmallLinkActive(heading.slug)}
                >
                  {heading.value}
                </SmallLink>
              )
          )}
        </Submenu>
      )}
    </LinkWrapper>
  )
}
