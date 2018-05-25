import React from 'react'
import { hot } from 'react-hot-loader'
import Theme from '<%- theme %>'

const socket = new WebSocket(`<%- websocketUrl %>`)
const _wrappers = [<% if (wrappers) {%><%- wrappers %><%}%>]

const recursiveWrappers = ([Wrapper, ...rest], props) => (
  <Wrapper {...props}>
    {rest.length ? recursiveWrappers(rest, props) : props.children}
  </Wrapper>
)

const Wrapper = props =>
  _wrappers.length ? recursiveWrappers(_wrappers, props) : props.children

class App extends React.Component {
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

export default hot(module)(App)
