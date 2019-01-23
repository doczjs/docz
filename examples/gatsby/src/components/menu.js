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
        <li>
          <Link to="/">Home</Link>
        </li>
        {data.allDoczEntries.edges.map(({ node }) => (
          <li>
            <Link key={node.id} to={node.route}>
              {node.name}
            </Link>
          </li>
        ))}
      </ul>
    )}
  />
)

export default Menu
