import './styles/global'

import * as React from 'react'
import { theme, DocPreview, ThemeConfig } from 'docz'
import { ThemeProvider } from 'emotion-theming'
import webfont from 'webfontloader'
import ReactBreakpoints from 'react-breakpoints'

import { config } from './config'
import { Sidebar, Main } from './components/shared'
import { mq, breakpoints } from './styles/responsive'
import * as components from './components/ui'
import * as modes from './styles/modes'
import * as prismThemes from './styles/prism'

const Theme = () => (
  <ThemeConfig>
    {config => (
      <ThemeProvider theme={{ ...config, mq, breakpoints }}>
        <ReactBreakpoints breakpoints={breakpoints}>
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
                p: components.Paragraph,
                a: components.Link,
                inlineCode: components.InlineCode,
                loading: components.Loading,
                table: components.Table,
                pre: components.Pre,
                tooltip: components.Tooltip,
              }}
            />
          </Main>
        </ReactBreakpoints>
      </ThemeProvider>
    )}
  </ThemeConfig>
)

webfont.load({
  google: {
    families: ['Inconsolata', 'Source Sans Pro:300,400,600,700'],
  },
})

const transform = ({ mode, ...config }: any) => ({
  ...config,
  prismTheme: (prismThemes as any)[mode],
  colors: (modes as any)[mode],
})

export default theme(config, transform)(Theme)
