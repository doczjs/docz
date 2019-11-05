import React from 'react'
import { Playground as OriginalPlayground } from 'gatsby-theme-docz/src/components/Playground/index'

export const Playground = props => {
  return (
    <div style={{ background: 'rebeccapurple', padding: 12 }}>
      <OriginalPlayground {...props} />
    </div>
  )
}
