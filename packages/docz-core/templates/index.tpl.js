import React from 'react'
import ReactDOM from 'react-dom'

import { imports } from './imports'
import Root from './root'

const _beforeRenders = [<% if (beforeRenders) {%><%- beforeRenders %><%}%>]
const _afterRenders = [<% if (afterRenders) {%><%- afterRenders %><%}%>]

const beforeRender = () => _beforeRenders.forEach(f => f && f())
const afterRender = () => _afterRenders.forEach(f => f && f())

const root = document.querySelector('#root')
const render = (Component = Root) => {
  beforeRender()
  ReactDOM.render(<Component imports={imports} />, root, afterRender)
}

if (module.hot) {
  module.hot.accept('./imports', () => render(Root))
}

render(Root)
