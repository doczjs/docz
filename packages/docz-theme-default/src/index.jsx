import './styles'

import * as React from 'react'

import { createTheme } from 'docz'
import { injectGlobal } from 'emotion'
import { Helmet } from 'react-helmet'
import { createBrowserHistory } from 'history'
import { Router } from 'react-router-dom'

import { Main } from './components/Main'
import { Menu } from './components/Menu'
import { View } from './components/View'

export const Theme = createTheme(() => (
  <Router history={createBrowserHistory()}>
    <Main>
      <Menu />
      <View />
    </Main>
  </Router>
))
