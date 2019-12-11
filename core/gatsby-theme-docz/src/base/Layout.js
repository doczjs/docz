import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { useComponents } from 'docz'
import { MDXProvider } from '@mdx-js/react'
import { propEq, get } from 'lodash/fp'

import { useDbQuery } from '../hooks/useDbQuery'
import Wrapper from '../wrapper'
import Theme from '../index'
import SEO from './Seo'

const Route = ({ children, entry, ...defaultProps }) => {
  const components = useComponents()
  const NotFound = components.notFound
  const Layout = components.layout
  const props = { ...defaultProps, doc: entry }
  if (!entry) return <NotFound />
  return (
    <Wrapper doc={entry}>
      <Layout {...props}>{children}</Layout>
    </Wrapper>
  )
}

const findEntry = (db, ctx) => {
  const isIndex = ctx.frontmatter && ctx.frontmatter.route === '/'
  const eqIndex = propEq('value.route', '/')
  if (!ctx.entry && isIndex) return db.entries.find(eqIndex)
  const filepath = get('entry.filepath', ctx)
  return db.entries.find(propEq('value.filepath', filepath))
}

const Layout = ({ children, ...defaultProps }) => {
  const { pageContext: ctx } = defaultProps
  const db = useDbQuery()
  const entry = findEntry(db, ctx)
  return (
    <Fragment>
      {entry && <SEO title={entry.value.name} />}
      <Theme db={db} currentEntry={entry}>
        <Route {...defaultProps} entry={entry}>
          {children}
        </Route>
      </Theme>
    </Fragment>
  )
}

Layout.propTypes = {
  color: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default Layout
