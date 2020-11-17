import React, { Fragment } from 'react'
import { Helmet } from 'react-helmet-async'

const Wrapper = ({ children, doc }) => {
  return (
    <Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{doc.value.name}</title>
        <link
          rel="icon"
          type="image/png"
          href="https://placekitten.com/50/50"
        />
      </Helmet>
      {children}
    </Fragment>
  )
}

export default Wrapper
