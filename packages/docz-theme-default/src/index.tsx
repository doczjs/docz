import { Fragment } from 'react'
import { theme, DocPreview, ThemeConfig } from 'docz'
import { ThemeProvider } from 'emotion-theming'
import { Global, jsx } from '@emotion/core'
import webfont from 'webfontloader'

import { config } from './config'
import { styles } from './styles/global'
import { mq } from './styles/responsive'
import * as components from './components/ui'
import * as modes from './styles/modes'

// tslint:disable
const mergeTheme = (config: any) => (old: any) => ({
  ...old,
  docz: Object.assign({}, config.themeConfig, { mq }),
})

const Theme = () => (
  <Fragment>
    <Global styles={styles} />
    <ThemeConfig>
      {config => (
        <ThemeProvider theme={mergeTheme(config)}>
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
  </Fragment>
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
