import React from 'react'
import { hot } from 'react-hot-loader'
import Theme from '<%- theme %>'
<% if (wrapper) {%>import Wrapper from '<%- wrapper %>'<%}%>
<% if (isProd) {%>import config from './config.json'<%}%>
<% if (isProd) {%>import entries from './entries.json'<%}%>

<% if (!isProd) {%>const socket = new WebSocket(`<%- websocketUrl %>`)<%}%>

<% if (!isProd) {%>
class Root extends React.Component {
  constructor(props, ctx) {
    super(props, ctx)
    this.state = {
      entries: {},
      config: {},
    }
  }

  async componentDidMount() {
    socket.onmessage = ev => {
      const message = JSON.parse(ev.data)

      if (message.type === 'PARSE_ENTRIES') {
        this.setState({ entries: message.payload })
      }

      if (message.type === 'PARSE_CONFIG') {
        this.setState({ config: message.payload })
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
