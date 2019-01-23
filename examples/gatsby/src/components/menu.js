import React from 'react'
import { Link, StaticQuery, graphql } from 'gatsby'

const Menu = ({ data }) => (
  <StaticQuery
    query={graphql`
      query Menu {
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
    render={data => (
      <ul>
        {data.allDoczEntries.edges.map(({ node }) => (
          <Link key={node.id} to={node.route}>
            <li>{node.name}</li>
          </Link>
        ))}
      </ul>
    )}
  />
)

export default Menu
