import './styles'

import * as React from 'react'

import { injectGlobal } from 'emotion'
import { BrowserRouter } from 'react-router-dom'
import { theme } from 'docz-react'

import { Main } from './components/Main'
import { Menu } from './components/Menu'
import { View } from './components/View'

export const Theme = theme(() => (
  <BrowserRouter>
    <Main>
      <Menu />
      <View />
    </Main>
  </BrowserRouter>
))
