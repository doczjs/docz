import React from 'react'
import { Link, Router, Routes, useDataServer } from 'docz'
import { hot } from 'react-hot-loader/root'
import Theme from '<%- theme %>'

import { imports } from './imports'
import database from './db.json'
<% if (wrapper) {%>import Wrapper from '<%- wrapper %>'<%}%>

const Root = () => {
  <% if (websocketUrl) {%>useDataServer('<%- websocketUrl %>')<%}%>
  return (
    <Theme
      <% if (wrapper) {%>wrapper={Wrapper}<%}%>
      linkComponent={Link}
      db={database}
      >
        <Routes imports={imports} />
    </Theme>
  )
}

export default hot(module)(Root)
