import { ComponentType } from 'react'
import * as React from 'react'
import { Router } from 'react-router-dom'
import { createBrowserHistory, History } from 'history'
import { Provider } from 'unstated'

import { docsContainer } from '../DocsContainer'

export const history: History = createBrowserHistory()

interface ICreateThemeProps {
  routes: {
    [key: string]: string
  }
}

interface ICreateTheme {
  (WrappedComponent: ComponentType): ComponentType<ICreateThemeProps>
}

export const createTheme: ICreateTheme = WrappedComponent => () => (
  <Router history={history}>
    <Provider inject={[docsContainer]}>
      <WrappedComponent />
    </Provider>
  </Router>
)
