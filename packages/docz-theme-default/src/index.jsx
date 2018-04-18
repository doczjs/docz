import './styles'

import * as React from 'react'
import { createTheme } from 'docz'
import { injectGlobal } from 'emotion'
import { Helmet } from 'react-helmet'

import { Main } from './components/Main'
import { Menu } from './components/Menu'
import { View } from './components/View'

export const Theme = createTheme(() => (
  <React.Fragment>
    <Helmet>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css"
      />
    </Helmet>
    <Main>
      <Menu />
      <View />
    </Main>
  </React.Fragment>
))
