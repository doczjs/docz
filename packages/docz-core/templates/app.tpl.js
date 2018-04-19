import React from 'react'
import { hot } from 'react-hot-loader'
import { Theme } from '<%- theme %>'
import data from './data.json'

const _wrappers = [<% if (wrappers) {%><%- wrappers %><%}%>]

const recursiveWrappers = ([Wrapper, ...rest], props) => (
  <Wrapper {...props}>
    {rest.length ? recursiveWrappers(rest, props) : props.children}
  </Wrapper>
)

const Wrapper = props =>
  _wrappers.length ? recursiveWrappers(_wrappers, props) : props.children

const WrappedTheme = () => (
  <Wrapper>
    <Theme data={data} />
  </Wrapper>
)

export const App = hot(module)(WrappedTheme)
