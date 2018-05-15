import './styles'
import './styles/prism-theme'

import * as React from 'react'
import styled from 'react-emotion'
import { theme, DocPreview } from 'docz'

import * as components from './components'
import { Container } from './components'
import { Sidebar } from './modules/Sidebar'

export const Main = styled('div')`
  display: flex;
  height: 100vh;
`

const View = styled('div')`
  flex: 1;
  height: 100%;
  overflow-y: auto;
`

export const Theme = theme(() => (
  <Main>
    <Sidebar />
    <View>
      <Container>
        <DocPreview
          components={{
            h1: components.H1,
            h2: components.H2,
            h3: components.H3,
            table: components.Table,
            render: components.Render,
            tooltip: components.Tooltip,
            pre: components.Pre,
          }}
        />
      </Container>
    </View>
  </Main>
))
