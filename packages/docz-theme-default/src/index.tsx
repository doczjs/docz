import * as React from 'react'
import { theme, DocPreview, ThemeConfig } from 'docz'
import { ThemeProvider } from 'emotion-theming'

import { config } from './config'
import { Sidebar, Main } from './components/shared'
import * as components from './components/ui'

const Theme = () => (
  <ThemeConfig>
    {config => (
      <ThemeProvider theme={config}>
        <Main config={config}>
          <Sidebar />
          <DocPreview
            components={{
              page: components.Page,
              notFound: components.NotFound,
              render: components.Render,
              h1: components.H1,
              h2: components.H2,
              h3: components.H3,
              h4: components.H4,
              h5: components.H5,
              h6: components.H6,
              ul: components.List,
              loading: components.Loading,
              table: components.Table,
              pre: components.Pre,
              tooltip: components.Tooltip,
            }}
          />
        </Main>
      </ThemeProvider>
    )}
  </ThemeConfig>
)

export default theme(config)(Theme)
