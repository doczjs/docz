import './styles'
import './styles/prism-theme'

import * as React from 'react'
import styled from 'react-emotion'

import { BrowserRouter } from 'react-router-dom'
import { theme, Docs } from 'docz'

import { Menu } from './modules/Sidebar'
import { Doc } from './modules/Doc'

export const Main = styled('div')`
  display: flex;
  height: 100vh;
`

const View = styled('div')`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`

export const Theme = theme(() => (
  <BrowserRouter>
    <Main>
      <Menu />
      <View>
        <Docs>
          {({ docs }) => docs.map(doc => <Doc key={doc.id} {...doc} />)}
        </Docs>
      </View>
    </Main>
  </BrowserRouter>
))
