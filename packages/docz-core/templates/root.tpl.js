import React from 'react'
import { hot } from 'react-hot-loader'
import Theme from '<%- theme %>'
<% if (isProd) {%>import config from './config.json'<%}%>
<% if (isProd) {%>import entries from './entries.json'<%}%>

<% if (isProd) {%>const socket = new WebSocket(`<%- websocketUrl %>`)<%}%>
const _wrappers = [<% if (wrappers) {%><%- wrappers %><%}%>]

const recursiveWrappers = ([Wrapper, ...rest], props) => (
  <Wrapper {...props}>
    {rest.length ? recursiveWrappers(rest, props) : props.children}
  </Wrapper>
)

const Wrapper = props =>
  _wrappers.length ? recursiveWrappers(_wrappers, props) : props.children

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
    return <Theme {...this.state} imports={imports} wrapper={Wrapper} />
  }
}
<%} else {%>
const Root = ({ imports }) => (
  <Theme
    imports={imports}
    config={config}
    entries={entries}
    wrapper={Wrapper}
  />
)
<%}%>

export default hot(module)(Root)
