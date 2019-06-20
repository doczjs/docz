import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import { useComponents } from 'docz'
import { MDXProvider } from '@mdx-js/react'

import Theme from '../docz'
import Wrapper from '../docz/wrapper'
import SEO from './Seo'

const query = graphql`
  query Layout {
    doczDb {
      id
      db
    }
  }
`

const Route = ({ children, entry, ...defaultProps }) => {
  if (!entry) return <NotFound />

  const components = useComponents()
  const NotFound = components.notFound
  const Layout = components.layout
  const props = { ...defaultProps, doc: entry }

  return (
    <MDXProvider components={components}>
      <Wrapper>
        <Layout {...props}>{children}</Layout>
      </Wrapper>
    </MDXProvider>
  )
}

const parseDatabase = data => {
  try {
    return JSON.parse(data.doczDb.db)
  } catch (err) {
    return {}
  }
}

const Layout = ({ children, ...defaultProps }) => {
  const { pageContext: ctx } = defaultProps
  const data = useStaticQuery(query)
  const db = parseDatabase(data)
  const entry =
    db.entries && db.entries.find(entry => entry.filepath === ctx.filepath)

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
