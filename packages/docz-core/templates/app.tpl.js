<% ENTRIES.forEach(function(entry) { %>import '<%- entry.filepath %>'
<% }); %>
import React from 'react'
import { hot } from 'react-hot-loader'
import { Theme } from '<%- THEME %>'

const _wrappers = [<% if (WRAPPERS) {%><%- WRAPPERS %><%}%>]

const recursiveWrappers = ([Wrapper, ...rest], props) => (
  <Wrapper {...props}>
    {rest.length ? recursiveWrappers(rest, props) : props.children}
  </Wrapper>
)

const Wrapper = props =>
  _wrappers.length ? recursiveWrappers(_wrappers, props) : props.children

const WrappedTheme = () => (
  <Wrapper>
    <Theme />
  </Wrapper>
)

export const App = hot(module)(WrappedTheme)
