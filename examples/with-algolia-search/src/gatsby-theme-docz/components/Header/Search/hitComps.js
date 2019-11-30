import React from 'react'
import { Highlight, Snippet } from 'react-instantsearch-dom'
import { Link } from 'gatsby'

export const PageHit = clickHandler => ({ hit }) => (
  <div>
    <Link
      to={hit.route}
      onClick={clickHandler}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <h4>
        <Highlight attribute="name" hit={hit} tagName="mark" />{' '}
      </h4>
      <Snippet attribute="excerpt" hit={hit} tagName="mark" />
    </Link>
  </div>
)
