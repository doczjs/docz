import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'

import SEO from './seo'
import Menu from './menu'

const Layout = ({ children, pageContext: ctx }) => (
  <StaticQuery
    query={graphql`
      query Layout {
        allDoczEntries {
          edges {
            node {
              id
              name
              filepath
              route
            }
          }
        }
      }
    `}
    render={data => {
      const entry = data.allDoczEntries.edges
        .map(edge => edge.node)
        .find(node => {
          return node && ctx && node.filepath === ctx.filepath
        })

      return (
        <div>
          {entry && <SEO title={entry.name} />}
          <Menu />
          {children}
        </div>
      )
    }}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
