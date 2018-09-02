import './styles/global'

import * as React from 'react'
import { theme, DocPreview, ThemeConfig } from 'docz'
import { ThemeProvider } from 'emotion-theming'
import webfont from 'webfontloader'

import { config } from './config'
import { mq } from './styles/responsive'
import * as components from './components/ui'
import * as modes from './styles/modes'

const Theme = () => (
  <ThemeConfig>
    {config => (
      <ThemeProvider theme={{ docz: { ...config.themeConfig, mq } }}>
        <DocPreview
          components={{
            page: components.Page,
            notFound: components.NotFound,
            render: components.Render,
            blockquote: components.Blockquote,
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
      </ThemeProvider>
    )}
  </ThemeConfig>
)

webfont.load({
  google: {
    families: ['Source Code Pro', 'Source Sans Pro:300,400,600,700'],
  },
})

const transform = ({ mode, codemirrorTheme, ...config }: any) => {
  const selectedMode: any = (modes as any)[mode]

  return {
    ...config,
    mode,
    codemirrorTheme: codemirrorTheme || `docz-${mode}`,
    colors: {
      ...selectedMode,
      ...config.colors,
    },
  }
}

export default theme(config, transform)(Theme)
