import * as React from 'react'
import { SFC } from 'react'
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider'
import importedComponent from 'react-imported-component'

import { EntryMap } from '../state'
import { ComponentsMap } from './DocPreview'
import { AsyncComponent } from './AsyncComponent'

const loadFromImports = (path: string) => async () => {
  // tslint:disable-next-line
  const { imports } = await import('~imports')
  const { default: Component, getInitialData } = await imports[path]()
  const ExportedComponent: any = (props: any) => (
    <AsyncComponent {...props} as={Component} getInitialData={getInitialData} />
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

  const load = loadFromImports(path)
  const Component = withMDXComponents(
    importedComponent(load, { LoadingComponent })
  )

  return Page ? (
    <Page {...props}>
      <Component {...props} />
    </Page>
  ) : (
    <Component {...props} />
  )
}
