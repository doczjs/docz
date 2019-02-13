import { jsx } from '@emotion/core'
import { SFC, ComponentType } from 'react'
import { Docs, Entry, ThemeConfig } from 'docz'
import styled from '@emotion/styled'
import get from 'lodash.get'

import { get as themeGet } from '@utils/theme'

const sidebarPrimary = themeGet('colors.sidebarPrimary')
const primaryColor = themeGet('colors.primary')

const Submenu = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 0 0 24px;
`

const createSmallLink = (component: ComponentType<any>) => styled(component)`
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

const isSmallLinkActive = (slug: string) => (m: any, location: any) =>
  slug === location.hash.slice(1, Infinity)

const getHeadings = (route: string, docs: Entry[]) => {
  const doc = docs.find(doc => doc.route === route)
  const headings = get(doc, 'headings')

  return headings ? headings.filter(heading => heading.depth === 2) : []
}

interface MenuHeadingsProps {
  route: string
  onClick?: React.MouseEventHandler<any>
}

export const MenuHeadings: SFC<MenuHeadingsProps> = ({ route, onClick }) => (
  <Docs>
    {({ docs }) => {
      const headings = getHeadings(route, docs)

      return (
        <ThemeConfig>
          {({ linkComponent: Link }) => {
            const SmallLink = createSmallLink(Link)
            return (
              headings.length > 0 && (
                <Submenu>
                  {headings.map((heading: any) => (
                    <SmallLink
                      key={heading.slug}
                      onClick={onClick}
                      to={`${route}#${heading.slug}`}
                      isActive={isSmallLinkActive(heading.slug)}
                    >
                      {heading.value}
                    </SmallLink>
                  ))}
                </Submenu>
              )
            )
          }}
        </ThemeConfig>
      )
    }}
  </Docs>
)
