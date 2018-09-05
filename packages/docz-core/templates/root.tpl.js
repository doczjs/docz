import React from 'react'
import { hot } from 'react-hot-loader'
import Theme from '<%- theme %>'
import { HashRouter, BrowserRouter } from 'react-router-dom'

import { imports } from './imports'
import db from './db.json'

<% if (wrapper) {%>import Wrapper from '<%- wrapper %>'<%}%>

const Router = <%- hashRouter %> === true ? HashRouter : BrowserRouter

const Root = () => (
  <Router>
    <Theme
      db={db}
      imports={imports}
      <% if (!isProd) {%>websocketUrl="<%- websocketUrl %>"<%}%>
      <% if (wrapper) {%>wrapper={Wrapper}<%}%>
    />
  </Router>
)

export default hot(module)(Root)
