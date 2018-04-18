import { ComponentType } from 'react'
import * as React from 'react'
import { Provider } from 'unstated'

import { docsContainer } from '../DocsContainer'

interface CreateThemeProps {
  routes: {
    [key: string]: string
  }
}

type CreateTheme = (WC: ComponentType) => ComponentType<CreateThemeProps>

export const createTheme: CreateTheme = WrappedComponent => () => (
  <Provider inject={[docsContainer]}>
    <WrappedComponent />
  </Provider>
)
