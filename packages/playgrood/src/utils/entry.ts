import { IComponent } from './components'

const mountLink = (component: IComponent) =>
  `<li>
    <Link to="/${component.route}">${component.name}</Link>
  </li>`

const componentRoute = (component: IComponent) =>
  `class Route${component.name} extends React.Component {
    constructor(props, ctx) {
      super(props, ctx)
      this.state = {
        render: () => null
      }
    }

    async componentDidMount() {
      const { doc: render } = await import('${component.filepath}')
      this.setState({ render })
    }

    render() {
      return <div>{this.state.render()}</div>
    }
  }`

const mountRoute = (component: IComponent) =>
  `<Route
    exact
    path="/${component.route}"
    render={(props) => {
      const Comp = ${componentRoute(component)}
      return <Comp {...props} />
    }}
  />`

export const generateEntry = (components: IComponent[]) => {
  return `
    import 'babel-polyfill'

    import React from 'react'
    import { render } from 'react-dom'
    import { Router, Route, Link } from 'react-router-dom'
    import { createBrowserHistory } from 'history'

    const App = () => (
      <Router history={createBrowserHistory()}>
        <div>
          <ul>${components.map(mountLink).join('')}</ul>
          <div>${components.map(mountRoute).join('')}</div>
        </div>
      </Router>
    )

    render(<App />, document.querySelector('#root'))
  `
}
