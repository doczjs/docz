import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import { AsyncRoute, useComponents } from 'docz'
import { MDXProvider } from '@mdx-js/react'

import { Link } from './Link'
import SEO from './Seo'
import Theme from '../docz'

const query = graphql`
  query Layout {
    doczDb {
      id
      db
    }
  }
`

const Route = ({ children, ...props }) => {
  const components = useComponents()
  const NotFound = components.NotFound
  if (!props.entry) return <NotFound />

  return (
    <MDXProvider components={components}>
      <AsyncRoute
        {...props}
        asyncComponent={() => <Fragment>{children}</Fragment>}
      />
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
      <Theme db={db} linkComponent={Link}>
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
