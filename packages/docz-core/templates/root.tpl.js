import React from 'react'
import { setConfig, hot } from 'react-hot-loader'
import Theme from '<%- theme %>'

<% if (wrapper) {%>import Wrapper from '<%- wrapper %>'<%}%>

const Root = () => (
  <Theme <% if (wrapper) {%>wrapper={Wrapper}<%}%> />
)

setConfig({
  ignoreSFC: true,
  pureRender: true,
})

export default hot(module)(Root)
