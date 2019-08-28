/** @jsx jsx */
import { jsx } from 'theme-ui'
import * as React from 'react' // eslint-disable-line
import { Link } from 'gatsby'
import { useDocs, useCurrentDoc } from 'docz'
import { get } from 'lodash/fp'

import * as styles from './styles'

const getHeadings = (route, docs) => {
  const doc = docs.find(doc => doc.route === route)
  const headings = get('headings', doc)
  return headings ? headings.filter(heading => heading.depth === 2) : []
}

export const NavLink = ({ item, ...props }) => {
  const docs = useDocs()
  const to = item.route
  const headings = docs && getHeadings(to, docs)
  const current = useCurrentDoc()
  const isCurrent = item.route === current.route
  const showHeadings = isCurrent && headings && headings.length > 0

  return (
    <>
      <Link {...props} to={to} sx={styles.link} activeClassName="active" />
      {showHeadings &&
        headings.map(heading => (
          <Link
            key={heading.slug}
            to={`${to}#${heading.slug}`}
            sx={styles.smallLink}
            activeClassName="active"
          >
            {heading.value}
          </Link>
        ))}
    </>
  )
}
