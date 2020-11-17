import React from 'react'
import { Helmet } from 'react-helmet-async'

const Wrapper = ({ children, doc }) => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{doc.value.name}</title>
        <link rel="icon" type="image/png" href="/public/favicon.png" />
      </Helmet>
      {children}
    </>
  )
}

export default Wrapper
