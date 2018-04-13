<% ENTRIES.forEach(function(entry) { %>import '<%- entry.filepath %>'
<% }); %>
import React from 'react'
import { hot } from 'react-hot-loader'
import { Theme } from '<%- THEME %>'

const _wrappers = [<%- WRAPPERS %>]

const recursiveWrappers = ([Wrapper, ...rest], props) => (
  <Wrapper {...props}>
    {rest.length ? recursiveWrappers(rest, props) : props.children}
  </Wrapper>
)

const Wrapper = props =>
  _wrappers.length ? recursiveWrappers(_wrappers, props) : props.children

const WrappedTheme = () => (
  <Wrapper>
    <Theme routes={<%- ROUTES %>} />
  </Wrapper>
)

export const App = hot(module)(WrappedTheme)
