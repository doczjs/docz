import * as React from 'react'
import OriginalWrapper from 'gatsby-theme-docz/src/wrapper'

const Wrapper = ({ children, doc }) => {
  return (
    <div style={{ background: 'pink', padding: 30 }}>
      <OriginalWrapper>{children}</OriginalWrapper>
    </div>
  )
}

export default Wrapper
