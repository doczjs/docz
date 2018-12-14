import React from 'react'
import { hot } from 'react-hot-loader'
import Theme from '<%- theme %>'

<% if (wrapper) {%>import Wrapper from '<%- wrapper %>'<%}%>

const Root = () => (
  <Theme
    <% if (!isProd) {%>hashRouter={<%- hashRouter %>}<%}%>
    <% if (!isProd) {%>websocketUrl="<%- websocketUrl %>"<%}%>
    <% if (wrapper) {%>wrapper={Wrapper}<%}%>
  />
)

export default hot(module)(Root)
