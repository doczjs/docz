import React from 'react'
import { hot } from 'react-hot-loader'
import Theme from '<%- theme %>'

<% if (wrapper) {%>import Wrapper from '<%- wrapper %>'<%}%>

const Root = () => (
  <Theme <% if (wrapper) {%>wrapper={Wrapper}<%}%> />
)

export default hot(module)(Root)
