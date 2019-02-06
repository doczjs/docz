import React from 'react'
import { Link, Router, Routes } from 'docz'
import { hot } from 'react-hot-loader'
import Theme from '<%- theme %>'

import { imports } from './imports'
import database from './db.json'
<% if (wrapper) {%>import Wrapper from '<%- wrapper %>'<%}%>

const Root = () => (
  <Theme
    <% if (wrapper) {%>wrapper={Wrapper}<%}%>
    <% if (websocketUrl) {%>websocketUrl="<%- websocketUrl %>"<%}%>
    db={database}
    linkComponent={Link}
  >
    <Router>
      <Routes imports={imports} />
    </Router>
  </Theme>
)

export default hot(module)(Root)
