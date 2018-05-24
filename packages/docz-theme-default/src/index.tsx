import './styles/prism-theme'

import * as React from 'react'
import styled from 'react-emotion'
import { theme, DocPreview, ThemeConfig } from 'docz'
import { ThemeProvider } from 'emotion-theming'

import * as components from './components/ui'
import { Container } from './components/ui'
import { Sidebar, Main } from './components/shared'
import { config } from './config'

const Page = styled('div')`
  flex: 1;
  height: 100%;
  overflow-y: auto;
`

const Theme = () => (
  <ThemeConfig>
    {({ config }) => (
      <ThemeProvider theme={config}>
        <Main config={config}>
          <Sidebar />
          <Page>
            <Container>
              <DocPreview
                components={{
                  h1: components.H1,
                  h2: components.H2,
                  h3: components.H3,
                  h4: components.H4,
                  h5: components.H5,
                  h6: components.H6,
                  ul: components.List,
                  table: components.Table,
                  render: components.Render,
                  tooltip: components.Tooltip,
                  pre: components.Pre,
                }}
              />
            </Container>
          </Page>
        </Main>
      </ThemeProvider>
    )}
  </ThemeConfig>
)

export default theme(Theme, config)
