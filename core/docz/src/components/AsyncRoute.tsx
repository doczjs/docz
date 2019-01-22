import * as React from 'react'
import { SFC } from 'react'
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider'
import importedComponent from 'react-imported-component'

import { EntryMap } from '../state'
import { ComponentsMap } from './DocPreview'
import { AsyncComponent } from './AsyncComponent'

export type Imports = Record<string, () => Promise<any>>
export async function loadFromImports(
  path: string,
  imports: Imports
): Promise<SFC<any>> {
  // tslint:disable-next-line
  const { default: Component, getInitialData } = await imports[path]()
  const ExportedComponent: SFC<any> = props => (
    <AsyncComponent
      {...props}
      as={Component || 'div'}
      getInitialData={getInitialData}
    />
  )

  return withMDXComponents(ExportedComponent)
}

export const loadRoute: any = (
  path: string,
  imports: Imports,
  LoadingComponent: any
) => {
  const opts: any = { LoadingComponent }
  return importedComponent(async () => loadFromImports(path, imports), opts)
}

interface AsyncRouteProps {
  asyncComponent: any
  components: ComponentsMap
  path: string
  entries: EntryMap
}

export const AsyncRoute: SFC<AsyncRouteProps> = ({
  components,
  asyncComponent,
  path,
  entries,
  ...routeProps
}) => {
  const Page: any = components.page
  const Component: any = asyncComponent
  const entry = entries && entries[path]
  const props = { ...routeProps, doc: entry }

  return Page ? (
    <Page {...props}>
      <Component {...props} />
    </Page>
  ) : (
    <Component {...props} />
  )
}
