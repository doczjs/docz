/** @jsx jsx */
import { jsx } from 'theme-ui'
import { theme as createTheme, ComponentsProvider } from 'docz'
import { Styled } from 'theme-ui'

import { componentsMap } from '@docz/components/ui'
import theme from '@docz/theme'
import { Layout } from './layout'

const Theme = ({ children }) => (
  <Layout>
    <ComponentsProvider components={componentsMap}>
      <Styled.root>{children}</Styled.root>
    </ComponentsProvider>
  </Layout>
)

export const enhance = createTheme(theme)
export default enhance(Theme)
