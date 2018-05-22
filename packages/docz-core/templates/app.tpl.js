import React from 'react'
import { hot } from 'react-hot-loader'
import { Theme } from '<%- theme %>'

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
    data: {},
    imports: {}
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      data: prevState.data,
      imports: nextProps.imports
    }
  }

  async componentDidMount() {
    socket.onmessage = ev => {
      const message = JSON.parse(ev.data)

      if (message.type === 'entries data') {
        this.setState({ data: message.data })
      }
    }
  }

  render() {
    return <Theme {...this.state} wrapper={Wrapper} />
  }
}

export default hot(module)(App)
