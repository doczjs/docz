import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Theme from 'docz-theme-default'
import { StaticQuery, graphql } from 'gatsby'
import { AsyncRoute } from 'docz'

import { Link } from './Link'
import SEO from './Seo'

const query = graphql`
  query Layout {
    doczDb {
      id
      db
    }
  }
`

const Route = ({ children, ...props }) => (
  <AsyncRoute
    {...props}
    asyncComponent={() => <Fragment>{children}</Fragment>}
  />
)

const Layout = ({ children, ...defaultProps }) => {
  const { pageContext: ctx } = defaultProps
  return (
    <StaticQuery
      query={query}
      render={data => {
        const db = JSON.parse(data.doczDb.db)
        const entry = db.entries.find(entry => entry.filepath === ctx.filepath)

        return (
          <Fragment>
            {entry && <SEO title={entry.value.name} />}
            <Theme db={db} linkComponent={Link}>
              {components => (
                <Route {...defaultProps} components={components} entry={entry}>
                  {children}
                </Route>
              )}
            </Theme>
          </Fragment>
        )
      }}
    />
  )
}

Layout.propTypes = {
  color: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default Layout
