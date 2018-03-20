import * as React from 'react'
import { Router } from 'react-router-dom'
import { createBrowserHistory, History } from 'history'
import { Provider } from 'unstated'

import { container } from '../documents/container'

export const history: History = createBrowserHistory()

export const Playgrodd: React.SFC = ({ children }) => (
  <Router history={history}>
    <Provider inject={[container]}>{children}</Provider>
  </Router>
)
