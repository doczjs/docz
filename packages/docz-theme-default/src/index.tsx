import { theme, DocPreview, ThemeConfig } from 'docz'
import { ThemeProvider } from 'emotion-theming'
import { jsx } from '@emotion/core'
import get from 'lodash.get'
import webfont from 'webfontloader'

import { config } from './config'
import * as components from './components/ui'
import * as modes from './styles/modes'

const Theme = () => (
  <ThemeConfig>
    {config => (
      <ThemeProvider
        theme={prev => ({
          ...prev,
          docz: config.themeConfig,
        })}
      >
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
            hr: components.Hr,
            ul: components.UnorderedList,
            ol: components.OrderedList,
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
    families: [
      'Source Code Pro',
      'Source Sans Pro:400,600',
      'Poppins:400',
      'Playfair Display:700',
    ],
  },
})

const enhance = theme(config, ({ mode, codemirrorTheme, ...config }) => ({
  ...config,
  mode,
  codemirrorTheme: codemirrorTheme || `docz-${mode}`,
  colors: {
    ...get(modes, mode),
    ...config.colors,
  },
}))

export {components}

export default enhance(Theme)
