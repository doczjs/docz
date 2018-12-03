import * as React from 'react'
import { SFC } from 'react'
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider'
import importedComponent from 'react-imported-component'

import { EntryMap } from '../state'
import { ComponentsMap } from './DocPreview'
import { AsyncComponent } from './AsyncComponent'

async function loadFromImports(path: string): Promise<SFC<any>> {
  // tslint:disable-next-line
  const { imports } = await import('~imports')
  const { default: Component, getInitialData } = await imports[path]()
  const ExportedComponent: SFC<any> = props => (
    <AsyncComponent
      {...props}
      as={Component || 'div'}
      getInitialData={getInitialData}
    />
  )

  return ExportedComponent
}

interface AsyncRouteProps {
  components: ComponentsMap
  path: string
  entries: EntryMap
}

export const AsyncRoute: SFC<AsyncRouteProps> = ({
  components,
  path,
  entries,
  ...routeProps
}) => {
  const Page: any = components.page
  const LoadingComponent: any = components.loading
  const entry = entries && entries[path]
  const props = { ...routeProps, doc: entry }

  const Component = withMDXComponents(
    importedComponent(async () => loadFromImports(path), { LoadingComponent })
  )

  return Page ? (
    <Page {...props}>
      <Component {...props} />
    </Page>
  ) : (
    <Component {...props} />
  )
}
