import * as React from 'react'
import { Router } from 'react-router-dom'
import { createBrowserHistory, History } from 'history'
import { Provider } from 'unstated'

import { container } from '../container'

export const history: History = createBrowserHistory()

export interface ICreateTheme {
  (WrappedComponent: React.ComponentType): React.ComponentType
}

export const createTheme: ICreateTheme = WrappedComponent => () => (
  <Router history={history}>
    <Provider inject={[container]}>
      <WrappedComponent />
    </Provider>
  </Router>
)
