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

// TODO: this is temporary until react-hot-loader fix hooks issues
setConfig({
  pureSFC: true,
})

export default hot(module)(Root)
