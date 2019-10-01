/** @jsx jsx */
import React from 'react'
import { jsx } from 'theme-ui'
import { Link } from 'gatsby'
import { useDocs, useCurrentDoc, MenuItem, Entry } from 'docz'
import { get } from 'lodash/fp'

import * as styles from './styles'

interface NavLinkProps extends Link<unknown> {
  item: MenuItem
}

function getHeadings(docs: Entry[], route?: string) {
  const doc = docs.find(doc => doc.route === route)
  const headings = get('headings', doc)
  return headings ? headings.filter(heading => heading.depth === 2) : []
}

function getCurrentHash() {
  if (typeof window === 'undefined') {
    return ''
  }
  return window.location ? window.location.hash : ''
}

export const NavLink: React.FunctionComponent<NavLinkProps> = ({
  item,
  ...props
}) => {
  const docs = useDocs()
  const to = item.route
  const headings = docs ? getHeadings(docs, to) : []
  const current = useCurrentDoc()
  const isCurrent = item.route === current.route
  const showHeadings = isCurrent && headings && headings.length > 0
  const currentHash = getCurrentHash()

  return (
    <React.Fragment>
      <Link
        {...props}
        to={to || ''}
        sx={styles.link}
        activeClassName="active"
      />
      {showHeadings &&
        headings.map(heading => (
          <Link
            key={heading.slug}
            to={`${to}#${heading.slug}`}
            sx={styles.smallLink}
            className={currentHash === `#${heading.slug}` ? 'active' : ''}
          >
            {heading.value}
          </Link>
        ))}
    </React.Fragment>
  )
}
