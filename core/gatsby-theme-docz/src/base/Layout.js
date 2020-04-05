import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { useComponents } from 'docz'
import { propEq, get } from 'lodash/fp'
import { MDXProvider } from '@mdx-js/react'

import { useDbQuery } from '../hooks/useDbQuery'
import Wrapper from '../wrapper'
import Theme from '../index'
import SEO from './Seo'

const Route = ({ children, entry, isTransclusion, ...defaultProps }) => {
  const components = useComponents()
  const NotFound = components.notFound
  const Layout = components.layout
  const props = { ...defaultProps, doc: entry }
  if (!entry && !isTransclusion) return <NotFound />
  return isTransclusion ? (
    children
  ) : (
    <MDXProvider components={components}>
      <Wrapper>
        <Layout {...props}>{children}</Layout>
      </Wrapper>
    </MDXProvider>
  )
}

const findEntry = (db, ctx) => {
  const isIndex = ctx && ctx.frontmatter && ctx.frontmatter.route === '/'
  const eqIndex = propEq('value.route', '/')
  if (ctx && !ctx.entry && isIndex) return db.entries.find(eqIndex)
  const filepath = get('entry.filepath', ctx)
  return db.entries.find(propEq('value.filepath', filepath))
}

const includesTransclusion = (db, props) => {
  const { entries } = db
  const filepath = get('_frontmatter.__filemeta.filename', props)
  return (
    !props.pageContext &&
    entries.includes(entries.find(propEq('value.filepath', filepath)))
  )
}

const Layout = ({ children, ...defaultProps }) => {
  const { pageContext: ctx } = defaultProps
  const db = useDbQuery()
  const entry = findEntry(db, ctx)
  const isTransclusion = includesTransclusion(db, defaultProps)
  return (
    <Fragment>
      {entry && <SEO title={entry.value.name} />}
      <Theme db={db} currentEntry={entry}>
        <Route {...defaultProps} entry={entry} isTransclusion={isTransclusion}>
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
