/** @jsx jsx */
import { jsx } from 'theme-ui'
import { SFC } from 'react'
import { theme as createTheme, ComponentsProvider } from 'docz'
import { Styled } from 'theme-ui'

import theme from '~theme'
import { Layout } from './Layout'
import { componentsMap } from './components/ui'

const Theme: SFC = ({ children }) => (
  <Layout>
    <ComponentsProvider components={componentsMap}>
      <Styled.root>{children}</Styled.root>
    </ComponentsProvider>
  </Layout>
)

export const enhance = createTheme(theme)
export default enhance(Theme)
