import * as React from 'react'
import { SFC } from 'react'
import { Entry, useDocs, useConfig } from 'docz'
import { Location } from '@reach/router'
import styled from '@emotion/styled'
import get from 'lodash/get'

import { SmallLink } from './SmallLink'

const Submenu = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 0 0 24px;
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

  return headings && headings.length > 0 ? (
    <Location>
      {({ location }) => (
        <Submenu>
          {headings.map((heading: any) => (
            <SmallLink
              as={Link}
              location={location}
              key={heading.slug}
              onClick={onClick}
              to={`${route}#${heading.slug}`}
              slug={heading.slug}
            >
              {heading.value}
            </SmallLink>
          ))}
        </Submenu>
      )}
    </Location>
  ) : null
}
