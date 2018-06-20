import React from 'react'
import { hot } from 'react-hot-loader'
import Theme from '<%- theme %>'
<% if (wrapper) {%>import Wrapper from '<%- wrapper %>'<%}%>
<% if (isProd) {%>import config from './config.json'<%}%>
<% if (isProd) {%>import entries from './entries.json'<%}%>

<% if (!isProd) {%>const socket = new WebSocket(`<%- websocketUrl %>`)<%}%>

<% if (!isProd) {%>
class Root extends React.Component {
  state = {
    config: {},
    entries: {},
  }

  async componentDidMount() {
    socket.onmessage = ev => {
      const message = JSON.parse(ev.data)

      if (message.type === 'docz.entries') {
        this.setState({ entries: message.data })
      }

      if (message.type === 'docz.config') {
        this.setState({ config: message.data })
      }
    }
  }

  render() {
    const { imports } = this.props

    return (
      <Theme
        {...this.state}
        imports={imports}
        hashRouter={<%- hashRouter %>}
        <% if (wrapper) {%>wrapper={Wrapper}<%}%>
      />
    )
  }
}
<%} else {%>
const Root = ({ imports }) => (
  <Theme
    config={config}
    entries={entries}
    imports={imports}
    hashRouter={<%- hashRouter %>}
    <% if (wrapper) {%>wrapper={Wrapper}<%}%>
  />
)
<%}%>

export default hot(module)(Root)
