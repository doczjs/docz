import * as React from 'react'
import { Router } from 'react-router-dom'
import { createBrowserHistory, History } from 'history'
import createContext from 'create-react-context'

export const history: History = createBrowserHistory()
export const PlaygroddContext = createContext({})

export interface IPlaygroddState {
  components: any
}

export class Playgrodd extends React.Component<{}, IPlaygroddState> {
  constructor(props: any) {
    super(props)

    this.state = {
      components: {},
    }
  }

  setComponents = () =>
    this.setState({ components: window.__PLAYGRODD_COMPONENTS__ })

  componentDidMount() {
    window.addEventListener('load', this.setComponents, false)
  }

  render() {
    return (
      <Router history={history}>
        <PlaygroddContext.Provider value={this.state.components}>
          {this.props.children}
        </PlaygroddContext.Provider>
      </Router>
    )
  }
}
