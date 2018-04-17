import { ComponentType } from 'react'
import * as React from 'react'
import { Router } from 'react-router-dom'
import { createBrowserHistory, History } from 'history'
import { Provider } from 'unstated'

import { docsContainer } from '../DocsContainer'

export const history: History = createBrowserHistory()

interface CreateThemeProps {
  routes: {
    [key: string]: string
  }
}

type CreateTheme = (WC: ComponentType) => ComponentType<CreateThemeProps>

export const createTheme: CreateTheme = WrappedComponent => () => (
  <Router history={history}>
    <Provider inject={[docsContainer]}>
      <WrappedComponent />
    </Provider>
  </Router>
)
