import React from 'react'
import { setConfig, hot } from 'react-hot-loader'
import Theme from '<%- theme %>'

import { imports } from './imports'
import db from './db.json'

<% if (wrapper) {%>import Wrapper from '<%- wrapper %>'<%}%>

const Root = () => (
  <Theme
    db={db}
    imports={imports}
    hashRouter={<%- hashRouter %>}
    <% if (!isProd) {%>websocketUrl="<%- websocketUrl %>"<%}%>
    <% if (wrapper) {%>wrapper={Wrapper}<%}%>
  />
)

// TODO: this is temporary until react-hot-loader fix hooks issues
setConfig({
  pureSFC: true,
})

export default hot(module)(Root)
