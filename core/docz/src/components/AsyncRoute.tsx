import * as React from 'react'
import { SFC } from 'react'
import loadable from '@loadable/component'

import { Entry } from '../state'
import { useComponents, ComponentsMap } from '../hooks/useComponents'
import { AsyncComponent } from './AsyncComponent'

export type Imports = Record<string, () => Promise<any>>
export const loadRoute = (path: string, imports: Imports) => {
  return loadable(async () => {
    const { default: Component, getInitialData } = await imports[path]()
    const ExportedComponent: SFC<any> = props => (
      <AsyncComponent
        {...props}
        as={Component || 'div'}
        getInitialData={getInitialData}
      />
    )

    return ExportedComponent
  })
}

interface AsyncRouteProps {
  asyncComponent: any
  components: ComponentsMap
  path: string
  entry: Entry
}

export const AsyncRoute: SFC<AsyncRouteProps> = defaultProps => {
  const { asyncComponent, path, entry, ...routeProps } = defaultProps
  const components = useComponents()
  const Page: any = components.page
  const Component: any = asyncComponent
  const props = { ...routeProps, doc: entry }

  return Page ? (
    <Page {...props}>
      <Component {...props} />
    </Page>
  ) : (
    <Component {...props} />
  )
}
