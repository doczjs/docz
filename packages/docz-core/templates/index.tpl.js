import React from 'react'
import { render } from 'react-dom'
import { App } from './app'

const _beforeRenders = [<% if (beforeRenders) {%><%- beforeRenders %><%}%>]
const _afterRenders = [<% if (afterRenders) {%><%- afterRenders %><%}%>]

const beforeRender = () => _beforeRenders.forEach(f => f && f())
const afterRender = () => _afterRenders.forEach(f => f && f())

beforeRender()
render(<App />, document.querySelector('#root'), afterRender)
