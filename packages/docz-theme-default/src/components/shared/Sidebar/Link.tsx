import * as React from 'react'
import { SFC } from 'react'
import { Link as BaseLink, LinkProps as BaseLinkProps, Entry } from 'docz'

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
  padding-left: 0;

  &:after {
    width: 1px;
  }
`

const LinkWrapper = styled('div')`
  position: relative;
  transition: padding 0.2s;

  &:after {
    position: absolute;
    display: block;
    content: '';
    top: 30px;
    left: 16px;
    width: 0;
    height: calc(100% - 36px);
    background: ${p => p.theme.colors.border};
    transition: width 0.2s;
  }

  ${(p: LinkWrapperProps) => p.active && activeWrapper(p)};
`

const isActive = (doc: Entry, location: any) => {
  return doc.route === location.pathname
}

const SmallLink = styled(BaseLink)`
  position: relative;
  font-size: 14px;
  padding: 0 0 5px 16px;
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

  &:before {
    z-index: 1;
    position: absolute;
    display: block;
    content: '';
    top: 0;
    left: 2px;
    width: 0;
    height: 20px;
    background: ${p => p.theme.colors.primary};
    transition: width 0.2s;
  }

  &.active:before {
    width: 2px;
  }
`

const Submenu = styled('div')`
  display: flex;
  flex-direction: column;
  margin: 5px 0 0 14px;
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
