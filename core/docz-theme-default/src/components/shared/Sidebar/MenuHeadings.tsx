import * as React from 'react'
import { SFC, useMemo } from 'react'
import { Entry, useDocs, useConfig } from 'docz'
import styled from 'styled-components'
import get from 'lodash/get'

import { get as themeGet } from '@utils/theme'

const sidebarPrimary = themeGet('colors.sidebarPrimary')
const primaryColor = themeGet('colors.primary')

const Submenu = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 0 0 24px;
`

const createSmallLink = (Link: React.ComponentType<any>) => styled(Link)`
  position: relative;
  font-size: 14px;
  padding: 0 0 5px 16px;
  text-decoration: none;
  opacity: 0.5;
  transition: opacity 0.2s;
  &,
  &:visited,
  &.active {
    color: ${themeGet('colors.sidebarText')};
  }
  &.active {
    opacity: 1;
  }
  &:before {
    z-index: 1;
    position: absolute;
    display: block;
    content: '';
    top: 1px;
    left: 0;
    width: 0;
    height: 20px;
    background: ${p => sidebarPrimary(p) || primaryColor(p)};
    transition: width 0.2s;
  }
  &.active:before {
    width: 2px;
  }
`

const getHeadings = (route: string, docs: Entry[]) => {
  const doc = docs.find(doc => doc.route === route)
  const headings = get(doc, 'headings')
  return headings ? headings.filter(heading => heading.depth === 2) : []
}

interface MenuHeadingsProps {
  route: string
  onClick?: React.MouseEventHandler<any>
}

export const MenuHeadings: SFC<MenuHeadingsProps> = ({ route, onClick }) => {
  const docs = useDocs()
  const { linkComponent: Link } = useConfig()
  const headings = docs && getHeadings(route, docs)
  const SmallLink = useMemo(() => createSmallLink(Link!), [Link])

  return headings && headings.length > 0 ? (
    <Submenu>
      {headings.map((heading: any) => (
        <SmallLink
          key={heading.slug}
          onClick={onClick}
          to={`${route}#${heading.slug}`}
        >
          {heading.value}
        </SmallLink>
      ))}
    </Submenu>
  ) : null
}
