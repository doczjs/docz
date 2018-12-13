import React from 'react'
import { setConfig, hot } from 'react-hot-loader'
import Theme from '<%- theme %>'

<% if (wrapper) {%>import Wrapper from '<%- wrapper %>'<%}%>

const Root = () => (
  <Theme
    hashRouter={<%- hashRouter %>}
    <% if (!isProd) {%>websocketUrl="<%- websocketUrl %>"<%}%>
    <% if (wrapper) {%>wrapper={Wrapper}<%}%>
  />
)

export default hot(module)(Root)
