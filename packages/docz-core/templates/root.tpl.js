import React from 'react'
import { setConfig, hot } from 'react-hot-loader'
import Theme from '<%- theme %>'

import { imports } from './imports'
import db from './db.json'

<% if (wrapper) {%>import Wrapper from '<%- wrapper %>'<%}%>

const isDev = module.hot && process.env.NODE_ENV !== 'production'
let isHotUpdate = false
let root
if (typeof document !== 'undefined') {
  root = document.querySelector('#root')
  isHotUpdate = isDev && !!root.innerHTML
}

function injectUpdateStyleOnce() {
  const cssText = '@-webkit-keyframes bling{0%{background-color:#d9edf7}to{background-color:#d9edf7}}@-moz-keyframes bling{0%{background-color:#d9edf7}to{background-color:#d9edf7}}@-o-keyframes bling{0%{background-color:#d9edf7}to{background-color:#d9edf7}}@keyframes bling{0%{background-color:#d9edf7}to{background-color:#d9edf7}}.detected-updated,.detected-updated pre{-webkit-animation:bling 2.5s 1;-moz-animation:bling 2.5s 1;-o-animation:bling 2.5s 1;animation:bling 2.5s 1}'
  if (typeof document !== 'undefined' && !global.__INJECTED_UPDATED_CSS_TEXT__) {
    const style = document.createElement('style')
    style.textContent = cssText
    style.type = 'text/css'
    document.head.appendChild(style)
    global.__INJECTED_UPDATED_CSS_TEXT__ = true
  }
}

class Root extends React.Component {
  componentDidUpdate() {
    if (isHotUpdate && root) {
      setTimeout(() => {
        const updateNode = root.querySelector('.detected-updated')
        if (updateNode) {
          updateNode.scrollIntoView({ behavior: 'smooth' })
          injectUpdateStyleOnce()
        }
      })
    }
  }
  render() {
    return (
      <Theme
        db={db}
        imports={imports}
        hashRouter={<%- hashRouter %>}
        <% if (!isProd) {%>websocketUrl="<%- websocketUrl %>"<%}%>
        <% if (wrapper) {%>wrapper={Wrapper}<%}%>
      />
    )
  }
}

// TODO: this is temporary until react-hot-loader fix hooks issues
setConfig({
  pureSFC: true,
})

export default hot(module)(Root)
