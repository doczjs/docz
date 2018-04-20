import './styles'

import * as React from 'react'

import { injectGlobal } from 'emotion'
import { createBrowserHistory } from 'history'
import { Helmet } from 'react-helmet'
import { Router } from 'react-router-dom'
import { theme } from 'docz'

import { Main } from './components/Main'
import { Menu } from './components/Menu'
import { View } from './components/View'

const history = createBrowserHistory()

export const Theme = theme(() => (
  <Router history={history}>
    <Main>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atelier-cave-dark.min.css"
        />
      </Helmet>
      <Menu />
      <View />
    </Main>
  </Router>
))
