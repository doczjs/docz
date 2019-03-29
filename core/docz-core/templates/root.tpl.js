import React from 'react'
import { Link, Router, Routes<% if (isProd) {%>, useDataServer<%}%> } from 'docz'
<% if (!isProd) {%>import { hot } from 'react-hot-loader'<%}%>
import Theme from '<%- theme %>'

import { imports } from './imports'
import database from './db.json'
<% if (wrapper) {%>import Wrapper from '<%- wrapper %>'<%}%>

const Root = () => {
  <% if (websocketUrl || isProd) {%>useDataServer('<%- websocketUrl %>')<%}%>
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

<% if (!isProd) {%>export default hot(module)(Root)<%}%>
<% if (isProd) {%>export default Root<%}%>
